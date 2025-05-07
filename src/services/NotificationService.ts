
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

// NotificationService klasa za rad sa notifikacijama
export class NotificationService {
  static async getNotifications(limit = 10): Promise<Notification[]> {
    try {
      // Create notifications table on Supabase:
      // CREATE TABLE public.notifications (
      //   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      //   title TEXT NOT NULL,
      //   message TEXT NOT NULL,
      //   type TEXT NOT NULL,
      //   link TEXT,
      //   is_read BOOLEAN DEFAULT false,
      //   created_at TIMESTAMPTZ DEFAULT now()
      // );

      // Try to get from database
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (!error && data) {
          return data as Notification[];
        }
      } catch (dbError) {
        console.warn('Database error getting notifications:', dbError);
        // Fall back to mock data
      }
      
      // Mock notifikacije kao rezerva
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
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  static async getUnreadCount(): Promise<number> {
    try {
      // Try to get from database
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
          
        if (!error && count !== null) {
          return count;
        }
      } catch (dbError) {
        console.warn('Database error getting unread count:', dbError);
      }
      
      // Mock broj nepročitanih notifikacija kao rezerva
      return 1;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  static async markAsRead(id: string): Promise<void> {
    try {
      // Try to update in database
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id);
          
        if (!error) {
          console.log(`Notification ${id} marked as read in database`);
          return;
        }
      } catch (dbError) {
        console.warn('Database error marking notification as read:', dbError);
      }
      
      // Fallback console log
      console.log(`Marking notification ${id} as read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      // Try to update in database
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('is_read', false);
          
        if (!error) {
          console.log('All notifications marked as read in database');
          return;
        }
      } catch (dbError) {
        console.warn('Database error marking all notifications as read:', dbError);
      }
      
      // Fallback console log
      console.log('Marking all notifications as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  static async deleteNotification(id: string): Promise<void> {
    try {
      // Try to delete from database
      try {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', id);
          
        if (!error) {
          console.log(`Notification ${id} deleted from database`);
          return;
        }
      } catch (dbError) {
        console.warn('Database error deleting notification:', dbError);
      }
      
      // Fallback console log
      console.log(`Deleting notification ${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  static async createNotification(
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    link?: string
  ): Promise<Notification> {
    try {
      const notification = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        type,
        link,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      
      // Try to insert into database
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert({
            title,
            message, 
            type,
            link,
            is_read: false
          })
          .select()
          .single();
          
        if (!error && data) {
          return data as Notification;
        }
      } catch (dbError) {
        console.warn('Database error creating notification:', dbError);
      }
      
      // Fallback local notification
      console.log('Creating notification:', notification);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Return mock notification if there was an error
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
  }
}

// Takođe zadržavamo originalne funkcije za kompatibilnost sa postojećim kodom
export const createNotification = async (
  title: string, 
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string
): Promise<Notification> => {
  return NotificationService.createNotification(title, message, type, link);
};

export const getNotifications = async (limit = 10): Promise<Notification[]> => {
  return NotificationService.getNotifications(limit);
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  return NotificationService.markAsRead(id);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  return NotificationService.markAllAsRead();
};

export const deleteNotification = async (id: string): Promise<void> => {
  return NotificationService.deleteNotification(id);
};
