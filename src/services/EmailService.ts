
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'shipping_notification',
        subject: 'Your Order Has Been Shipped - MobShop',
        body_html: '<p>Your order #{{order_id}} has been shipped! Tracking number: {{tracking_number}}</p>',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'welcome_email',
        subject: 'Welcome to MobShop!',
        body_html: '<p>Welcome to MobShop, {{name}}! Thank you for creating an account.</p>',
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
  
  // Get all email templates
  getTemplates: async (): Promise<EmailTemplate[]> => {
    return getEmailTemplates();
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
  }
};
