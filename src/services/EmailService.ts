
import { supabase } from '@/integrations/supabase/client';

export interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  enableSSL: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[]; // List of variables that can be used in the template
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  attachments?: any[];
}

export class EmailService {
  private static settings: EmailSettings | null = null;
  private static templates: EmailTemplate[] = [];
  private static readonly SETTINGS_KEY = 'email_settings';
  private static readonly TEMPLATES_KEY = 'email_templates';

  // Load settings from Supabase or localStorage
  static async loadSettings(): Promise<EmailSettings | null> {
    try {
      // Try to load from Supabase settings table
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('key', this.SETTINGS_KEY)
          .single();
          
        if (!error && data && data.value) {
          this.settings = JSON.parse(data.value);
          return this.settings;
        }
      } catch (dbError) {
        console.warn('Error loading email settings from database:', dbError);
      }
      
      // Fall back to localStorage
      const storedSettings = localStorage.getItem(this.SETTINGS_KEY);
      if (storedSettings) {
        this.settings = JSON.parse(storedSettings);
        return this.settings;
      }
      
      // Return default settings if nothing is found
      this.settings = {
        smtpServer: 'smtp.gmail.com',
        smtpPort: 587,
        username: 'your-email@gmail.com',
        password: '',
        fromEmail: 'your-email@gmail.com',
        fromName: 'Your Store Name',
        enableSSL: true,
      };
      
      return this.settings;
    } catch (error) {
      console.error('Error loading email settings:', error);
      return null;
    }
  }

  // Save settings to Supabase and localStorage
  static async saveSettings(settings: EmailSettings): Promise<boolean> {
    try {
      this.settings = settings;
      
      // Save to localStorage as a fallback
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      
      // Try to save to Supabase settings table
      try {
        const { error } = await supabase
          .from('settings')
          .upsert({
            key: this.SETTINGS_KEY,
            value: JSON.stringify(settings),
            updated_at: new Date().toISOString()
          });
          
        if (!error) {
          console.log('Email settings saved to database');
          return true;
        }
      } catch (dbError) {
        console.warn('Error saving email settings to database:', dbError);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving email settings:', error);
      return false;
    }
  }

  // Load email templates
  static async loadTemplates(): Promise<EmailTemplate[]> {
    try {
      // Try to load from Supabase
      try {
        const { data, error } = await supabase
          .from('email_templates')
          .select('*')
          .order('name');
          
        if (!error && data) {
          this.templates = data as EmailTemplate[];
          return this.templates;
        }
      } catch (dbError) {
        console.warn('Error loading email templates from database:', dbError);
      }
      
      // Fall back to localStorage
      const storedTemplates = localStorage.getItem(this.TEMPLATES_KEY);
      if (storedTemplates) {
        this.templates = JSON.parse(storedTemplates);
        return this.templates;
      }
      
      // Return default templates if nothing is found
      this.templates = [
        {
          id: '1',
          name: 'order_confirmation',
          subject: 'Potvrda porudžbine - {order_id}',
          body: `<h1>Hvala na porudžbini!</h1>
<p>Poštovani/a {customer_name},</p>
<p>Uspešno ste napravili porudžbinu.</p>
<p>ID porudžbine: {order_id}</p>
<p>Ukupan iznos: {total_amount} RSD</p>
<p>Očekivani datum isporuke: {delivery_date}</p>`,
          variables: ['customer_name', 'order_id', 'total_amount', 'delivery_date']
        },
        {
          id: '2',
          name: 'shipping_confirmation',
          subject: 'Vaša porudžbina je poslata - {order_id}',
          body: `<h1>Porudžbina je poslata!</h1>
<p>Poštovani/a {customer_name},</p>
<p>Vaša porudžbina je poslata i biće isporučena u roku od {delivery_days} radnih dana.</p>
<p>ID porudžbine: {order_id}</p>
<p>Broj za praćenje: {tracking_number}</p>`,
          variables: ['customer_name', 'order_id', 'delivery_days', 'tracking_number']
        }
      ];
      
      // Save default templates to localStorage
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(this.templates));
      
      return this.templates;
    } catch (error) {
      console.error('Error loading email templates:', error);
      return [];
    }
  }

  // Send email (in real implementation this would connect to SMTP server or use an API)
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.settings) {
        await this.loadSettings();
      }
      
      console.log('Sending email:', {
        ...emailData,
        settings: this.settings
      });
      
      // In production environment, this would connect to an actual email service
      // For now, we'll just log the attempt and return success
      
      // Example of how this might work with a real email API:
      // const response = await fetch('https://api.youremailservice.com/send', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     from: `${this.settings?.fromName} <${this.settings?.fromEmail}>`,
      //     to: emailData.to,
      //     subject: emailData.subject,
      //     html: emailData.body,
      //     attachments: emailData.attachments || []
      //   })
      // });
      // return response.ok;
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Get a specific template and replace variables with values
  static async getRenderedTemplate(
    templateName: string, 
    variables: Record<string, string>
  ): Promise<{ subject: string; body: string } | null> {
    try {
      if (this.templates.length === 0) {
        await this.loadTemplates();
      }
      
      const template = this.templates.find(t => t.name === templateName);
      if (!template) {
        return null;
      }
      
      let subject = template.subject;
      let body = template.body;
      
      // Replace all variables in subject and body
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, 'g');
        subject = subject.replace(regex, value);
        body = body.replace(regex, value);
      });
      
      return { subject, body };
    } catch (error) {
      console.error('Error rendering email template:', error);
      return null;
    }
  }

  // Send an order confirmation email
  static async sendOrderConfirmationEmail(
    customerEmail: string,
    customerName: string,
    orderId: string,
    totalAmount: number
  ): Promise<boolean> {
    try {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3); // Estimated delivery in 3 days
      
      const template = await this.getRenderedTemplate('order_confirmation', {
        customer_name: customerName,
        order_id: orderId,
        total_amount: totalAmount.toString(),
        delivery_date: deliveryDate.toLocaleDateString('sr-RS')
      });
      
      if (!template) {
        return false;
      }
      
      return await this.sendEmail({
        to: customerEmail,
        subject: template.subject,
        body: template.body
      });
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  }
}
