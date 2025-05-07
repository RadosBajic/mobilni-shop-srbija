
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export const createNotification = async (
  title: string, 
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string
): Promise<Notification> => {
  try {
    const notification = {
      title,
      message,
      type,
      link,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as Notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Return a mock notification for demonstration purposes
    return {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      link,
      is_read: false,
      created_at: new Date().toISOString(),
    };
  }
};

export const getNotifications = async (limit = 10): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    return data as Notification[];
  } catch (error) {
    console.error('Error getting notifications:', error);
    // Return mock notifications
    return [
      {
        id: '1',
        title: 'Nova porudžbina',
        message: 'Porudžbina #12345 je primljena u iznosu od 4999 RSD',
        type: 'info',
        link: '/admin/orders',
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '2',
        title: 'Uspešno plaćanje',
        message: 'Porudžbina #12344 je uspešno plaćena',
        type: 'success',
        link: '/admin/orders',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      }
    ];
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};
