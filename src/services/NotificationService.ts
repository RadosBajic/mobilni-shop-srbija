
import { NotificationType } from '@/types/banners';

// Mock storage for notifications
let notifications: NotificationType[] = [
  {
    id: 'n1',
    title: 'New Order',
    message: 'You have received a new order #12345',
    type: 'info',
    date: new Date().toISOString(),
    read: false,
    link: '/admin/orders'
  },
  {
    id: 'n2',
    title: 'Low Stock Alert',
    message: 'The product "iPhone 13 Case" is running low on stock',
    type: 'warning',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/admin/products'
  },
  {
    id: 'n3',
    title: 'Payment Received',
    message: 'Payment for order #12340 has been successfully processed',
    type: 'success',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/admin/orders'
  }
];

export const NotificationService = {
  getNotifications: (): Promise<NotificationType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...notifications].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }, 300);
    });
  },

  getUnreadCount: (): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = notifications.filter(n => !n.read).length;
        resolve(count);
      }, 100);
    });
  },

  markAsRead: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          notifications[index].read = true;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  },

  markAllAsRead: (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        notifications = notifications.map(n => ({ ...n, read: true }));
        resolve(true);
      }, 200);
    });
  },

  addNotification: (notification: Omit<NotificationType, 'id' | 'date'>): Promise<NotificationType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNotification = {
          ...notification,
          id: `n${notifications.length + 1}`,
          date: new Date().toISOString(),
        };
        notifications.unshift(newNotification);
        resolve(newNotification);
      }, 200);
    });
  },

  deleteNotification: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = notifications.length;
        notifications = notifications.filter(n => n.id !== id);
        resolve(notifications.length < initialLength);
      }, 200);
    });
  },

  clearAll: (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        notifications = [];
        resolve(true);
      }, 200);
    });
  }
};

// Helper function to create a notification and display it
export const createNotification = async (
  title: string, 
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string
): Promise<NotificationType> => {
  const notification = await NotificationService.addNotification({
    title,
    message,
    type,
    read: false,
    link
  });

  // In a real application, you might want to trigger an event or refresh a UI component
  // For now, we'll just console.log it
  console.log('New notification created:', notification);
  return notification;
};
