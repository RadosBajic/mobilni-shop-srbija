
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './EmailService';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
}

export interface Order {
  id: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'bank_transfer' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderData = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;

// Helper function to get orders from localStorage
const getOrdersFromStorage = (): Order[] => {
  const stored = localStorage.getItem('orders');
  return stored ? JSON.parse(stored) : [];
};

// Helper function to save orders to localStorage
const saveOrdersToStorage = (orders: Order[]): void => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

// Helper function to map database row to Order object
const mapToOrder = (order: any): Order => ({
  id: order.id || order.id,
  customerId: order.customerId || order.customer_id,
  customerName: order.customerName || order.customer_name,
  customerEmail: order.customerEmail || order.customer_email,
  customerPhone: order.customerPhone || order.customer_phone,
  shippingAddress: order.shippingAddress || order.shipping_address,
  items: order.items,
  totalAmount: order.totalAmount || order.total_amount,
  status: order.status,
  paymentMethod: order.paymentMethod || order.payment_method,
  paymentStatus: order.paymentStatus || order.payment_status,
  notes: order.notes,
  createdAt: order.createdAt || order.created_at,
  updatedAt: order.updatedAt || order.updated_at
});

export const OrderService = {
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    try {
      // For demo purposes, we'll use localStorage
      const newOrder: Order = {
        id: uuidv4(),
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const orders = getOrdersFromStorage();
      orders.push(newOrder);
      saveOrdersToStorage(orders);
          
      // Send order confirmation email
      try {
        await EmailService.sendOrderConfirmationEmail(
          orderData.customerEmail,
          orderData.customerName,
          newOrder.id,
          orderData.totalAmount
        );
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
      }
          
      return newOrder;
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },
  
  getOrders: async (): Promise<Order[]> => {
    try {
      const orders = getOrdersFromStorage();
      return orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  },
  
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const orders = getOrdersFromStorage();
      const order = orders.find(o => o.id === id);
      return order || null;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  },
  
  updateOrderStatus: async (id: string, status: Order['status']): Promise<boolean> => {
    try {
      const orders = getOrdersFromStorage();
      const orderIndex = orders.findIndex(o => o.id === id);
      
      if (orderIndex === -1) {
        return false;
      }
      
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      
      saveOrdersToStorage(orders);
      return true;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  },
  
  updatePaymentStatus: async (id: string, paymentStatus: Order['paymentStatus']): Promise<boolean> => {
    try {
      const orders = getOrdersFromStorage();
      const orderIndex = orders.findIndex(o => o.id === id);
      
      if (orderIndex === -1) {
        return false;
      }
      
      orders[orderIndex] = {
        ...orders[orderIndex],
        paymentStatus,
        updatedAt: new Date().toISOString()
      };
      
      saveOrdersToStorage(orders);
      return true;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      throw error;
    }
  },
  
  deleteOrder: async (id: string): Promise<boolean> => {
    try {
      const orders = getOrdersFromStorage();
      const newOrders = orders.filter(o => o.id !== id);
      saveOrdersToStorage(newOrders);
      return true;
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      throw error;
    }
  },
  
  updateOrderNotes: async (id: string, notes: string): Promise<boolean> => {
    try {
      const orders = getOrdersFromStorage();
      const orderIndex = orders.findIndex(o => o.id === id);
      
      if (orderIndex === -1) {
        return false;
      }
      
      orders[orderIndex] = {
        ...orders[orderIndex],
        notes,
        updatedAt: new Date().toISOString()
      };
      
      saveOrdersToStorage(orders);
      return true;
    } catch (error) {
      console.error('Error in updateOrderNotes:', error);
      throw error;
    }
  },
  
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      const orders = getOrdersFromStorage();
      return orders
        .filter(o => o.status === status)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error in getOrdersByStatus:', error);
      throw error;
    }
  },
  
  getOrdersByDateRange: async (startDate: Date, endDate: Date): Promise<Order[]> => {
    try {
      const orders = getOrdersFromStorage();
      return orders
        .filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= startDate && orderDate <= endDate;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error in getOrdersByDateRange:', error);
      throw error;
    }
  },
  
  bulkUpdateOrderStatus: async (ids: string[], status: Order['status']): Promise<boolean> => {
    try {
      if (!ids.length) return true;
      
      const orders = getOrdersFromStorage();
      const updatedOrders = orders.map(o => {
        if (ids.includes(o.id)) {
          return {
            ...o,
            status,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      });
      
      saveOrdersToStorage(updatedOrders);
      return true;
    } catch (error) {
      console.error('Error in bulkUpdateOrderStatus:', error);
      throw error;
    }
  },
  
  bulkUpdatePaymentStatus: async (ids: string[], paymentStatus: Order['paymentStatus']): Promise<boolean> => {
    try {
      if (!ids.length) return true;
      
      const orders = getOrdersFromStorage();
      const updatedOrders = orders.map(o => {
        if (ids.includes(o.id)) {
          return {
            ...o,
            paymentStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      });
      
      saveOrdersToStorage(updatedOrders);
      return true;
    } catch (error) {
      console.error('Error in bulkUpdatePaymentStatus:', error);
      throw error;
    }
  }
};
