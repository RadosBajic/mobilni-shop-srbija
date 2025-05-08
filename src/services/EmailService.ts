
import { v4 as uuidv4 } from 'uuid';

// Define types for email settings
export interface EmailSettings {
  id: string;
  smtp_server: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  use_ssl: boolean;
  created_at: string;
  updated_at: string;
}

// Define types for email templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

// Helper functions for localStorage
const getEmailSettings = (): EmailSettings | null => {
  const stored = localStorage.getItem('emailSettings');
  return stored ? JSON.parse(stored) : null;
};

const saveEmailSettings = (settings: EmailSettings): void => {
  localStorage.setItem('emailSettings', JSON.stringify(settings));
};

const getEmailTemplates = (): EmailTemplate[] => {
  const stored = localStorage.getItem('emailTemplates');
  return stored ? JSON.parse(stored) : [];
};

const saveEmailTemplates = (templates: EmailTemplate[]): void => {
  localStorage.setItem('emailTemplates', JSON.stringify(templates));
};

// Initialize with default data
const initializeEmailData = (): void => {
  // Initialize settings if they don't exist
  if (!getEmailSettings()) {
    const defaultSettings: EmailSettings = {
      id: uuidv4(),
      smtp_server: 'smtp.example.com',
      smtp_port: 587,
      smtp_username: 'user@example.com',
      smtp_password: 'password',
      from_email: 'noreply@mobshop.com',
      from_name: 'MobShop',
      use_ssl: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    saveEmailSettings(defaultSettings);
  }
  
  // Initialize templates if they don't exist
  if (getEmailTemplates().length === 0) {
    const defaultTemplates: EmailTemplate[] = [
      {
        id: uuidv4(),
        name: 'order_confirmation',
        subject: 'Order Confirmation - MobShop',
        body_html: '<p>Thank you for your order! Your order #{{order_id}} has been received.</p>',
        variables: ['order_id', 'customer_name', 'total'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'shipping_notification',
        subject: 'Your Order Has Been Shipped - MobShop',
        body_html: '<p>Your order #{{order_id}} has been shipped! Tracking number: {{tracking_number}}</p>',
        variables: ['order_id', 'customer_name', 'tracking_number'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'welcome_email',
        subject: 'Welcome to MobShop!',
        body_html: '<p>Welcome to MobShop, {{name}}! Thank you for creating an account.</p>',
        variables: ['name'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    saveEmailTemplates(defaultTemplates);
  }
};

// Call initialization
initializeEmailData();

// Email service
export const EmailService = {
  // Get email settings
  getSettings: async (): Promise<EmailSettings> => {
    const settings = getEmailSettings();
    if (!settings) {
      throw new Error('Email settings not found');
    }
    return settings;
  },
  
  // For compatibility with existing code
  loadSettings: async (): Promise<EmailSettings> => {
    return EmailService.getSettings();
  },
  
  // Update email settings
  updateSettings: async (settings: Partial<EmailSettings>): Promise<EmailSettings> => {
    const currentSettings = getEmailSettings();
    if (!currentSettings) {
      throw new Error('Email settings not found');
    }
    
    const updatedSettings: EmailSettings = {
      ...currentSettings,
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    saveEmailSettings(updatedSettings);
    return updatedSettings;
  },
  
  // Save settings (alias for updateSettings)
  saveSettings: async (settings: EmailSettings): Promise<boolean> => {
    try {
      await EmailService.updateSettings(settings);
      return true;
    } catch (error) {
      console.error('Error saving email settings:', error);
      return false;
    }
  },
  
  // Get all email templates
  getTemplates: async (): Promise<EmailTemplate[]> => {
    return getEmailTemplates();
  },
  
  // For compatibility with existing code
  loadTemplates: async (): Promise<EmailTemplate[]> => {
    return EmailService.getTemplates();
  },
  
  // Get a specific template by name
  getTemplateByName: async (name: string): Promise<EmailTemplate | null> => {
    const templates = getEmailTemplates();
    return templates.find(t => t.name === name) || null;
  },
  
  // Create a new email template
  createTemplate: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> => {
    const newTemplate: EmailTemplate = {
      id: uuidv4(),
      ...template,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const templates = getEmailTemplates();
    templates.push(newTemplate);
    saveEmailTemplates(templates);
    
    return newTemplate;
  },
  
  // Update an existing template
  updateTemplate: async (id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    const templates = getEmailTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    const updatedTemplate: EmailTemplate = {
      ...templates[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    templates[index] = updatedTemplate;
    saveEmailTemplates(templates);
    
    return updatedTemplate;
  },
  
  // Delete a template
  deleteTemplate: async (id: string): Promise<void> => {
    const templates = getEmailTemplates();
    const filtered = templates.filter(t => t.id !== id);
    saveEmailTemplates(filtered);
  },
  
  // Send a test email (mock implementation)
  sendTestEmail: async (to: string): Promise<boolean> => {
    console.log(`Sending test email to ${to}`);
    // In a real implementation, this would connect to an email service
    return true;
  },

  // Send email function
  sendEmail: async (options: { to: string, subject: string, body: string }): Promise<boolean> => {
    console.log('Sending email:', options);
    // This is a mock implementation
    return true;
  },

  // Send order confirmation email
  sendOrderConfirmationEmail: async (
    email: string,
    name: string,
    orderId: string,
    total: number
  ): Promise<boolean> => {
    try {
      const template = await EmailService.getTemplateByName('order_confirmation');
      if (!template) {
        throw new Error('Order confirmation template not found');
      }

      // Replace placeholders in the template
      let body = template.body_html
        .replace('{{order_id}}', orderId)
        .replace('{{customer_name}}', name)
        .replace('{{total}}', total.toString());

      return await EmailService.sendEmail({
        to: email,
        subject: template.subject,
        body: body
      });
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  }
};
