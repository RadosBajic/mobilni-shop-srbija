
import { v4 as uuidv4 } from 'uuid';

// Define the Notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

// Helper function to get notifications from localStorage
const getNotificationsFromStorage = (): Notification[] => {
  const stored = localStorage.getItem('notifications');
  return stored ? JSON.parse(stored) : [];
};

// Helper function to save notifications to localStorage
const saveNotificationsToStorage = (notifications: Notification[]): void => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

// Mock data for initial notifications
const generateInitialNotifications = (): Notification[] => {
  return [
    {
      id: uuidv4(),
      title: 'New Order',
      message: 'You received a new order #12345',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      is_read: false,
      type: 'info',
      link: '/admin/orders/12345'
    },
    {
      id: uuidv4(),
      title: 'Low Stock Alert',
      message: 'Product "Wireless Earbuds" is running low on stock',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      is_read: false,
      type: 'warning',
      link: '/admin/products'
    },
    {
      id: uuidv4(),
      title: 'Payment Received',
      message: 'Payment for order #12344 was successfully processed',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      is_read: true,
      type: 'success',
      link: '/admin/orders/12344'
    }
  ];
};

// Initialize notifications if none exist
const initializeNotifications = (): void => {
  const existing = getNotificationsFromStorage();
  if (existing.length === 0) {
    saveNotificationsToStorage(generateInitialNotifications());
  }
};

// Call initialization
initializeNotifications();

// Service methods
export const NotificationService = {
  // Get all notifications
  getNotifications: async (): Promise<Notification[]> => {
    return getNotificationsFromStorage();
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const notifications = getNotificationsFromStorage();
    return notifications.filter(notification => !notification.is_read).length;
  },

  // Mark a notification as read
  markAsRead: async (id: string): Promise<void> => {
    const notifications = getNotificationsFromStorage();
    const updated = notifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, is_read: true };
      }
      return notification;
    });
    saveNotificationsToStorage(updated);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    const notifications = getNotificationsFromStorage();
    const updated = notifications.map(notification => ({
      ...notification,
      is_read: true
    }));
    saveNotificationsToStorage(updated);
  },

  // Create a new notification
  createNotification: async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<Notification> => {
    const newNotification: Notification = {
      id: uuidv4(),
      ...notification,
      created_at: new Date().toISOString(),
      is_read: false
    };
    
    const notifications = getNotificationsFromStorage();
    notifications.unshift(newNotification);
    saveNotificationsToStorage(notifications);
    
    return newNotification;
  },

  // Delete a notification
  deleteNotification: async (id: string): Promise<void> => {
    const notifications = getNotificationsFromStorage();
    const filtered = notifications.filter(notification => notification.id !== id);
    saveNotificationsToStorage(filtered);
  },

  // Clear all notifications
  clearAllNotifications: async (): Promise<void> => {
    saveNotificationsToStorage([]);
  }
};

// Export a standalone createNotification function for convenience
export const createNotification = async (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  link?: string
): Promise<Notification> => {
  return NotificationService.createNotification({ title, message, type, link });
};
