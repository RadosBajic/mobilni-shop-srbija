
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
      // Supabaze tabela za notifikacije trenutno ne postoji
      // U produkciji bi ovo bilo:
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      //   .limit(limit);
      //
      // if (error) throw error;
      // return data as Notification[];
      
      // Mock notifikacije za demonstraciju
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
      // U produkciji:
      // const { count, error } = await supabase
      //   .from('notifications')
      //   .select('*', { count: 'exact', head: true })
      //   .eq('is_read', false);
      //    
      // if (error) throw error;
      // return count || 0;
      
      // Mock broj nepročitanih notifikacija
      return 1;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  static async markAsRead(id: string): Promise<void> {
    try {
      // U produkciji:
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ is_read: true })
      //   .eq('id', id);
      //    
      // if (error) throw error;
      
      console.log(`Marking notification ${id} as read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      // U produkciji:
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ is_read: true })
      //   .eq('is_read', false);
      //    
      // if (error) throw error;
      
      console.log('Marking all notifications as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  static async deleteNotification(id: string): Promise<void> {
    try {
      // U produkciji:
      // const { error } = await supabase
      //   .from('notifications')
      //   .delete()
      //   .eq('id', id);
      //    
      // if (error) throw error;
      
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
      
      // U produkciji bi bilo ubacivanje u bazu
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .insert(notification)
      //   .select()
      //   .single();
      //    
      // if (error) throw error;
      // return data as Notification;
      
      console.log('Creating notification:', notification);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Vraćamo mock notifikaciju ako je došlo do greške
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
