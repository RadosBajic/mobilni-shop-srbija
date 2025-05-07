import { executeQuery } from '@/lib/neon';
import { supabase } from '@/integrations/supabase/client';
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

// Helper function to map database row to Order object
const mapToOrder = (order: any): Order => ({
  id: order.id,
  customerId: order.customer_id,
  customerName: order.customer_name,
  customerEmail: order.customer_email,
  customerPhone: order.customer_phone,
  shippingAddress: order.shipping_address,
  items: order.items,
  totalAmount: order.total_amount,
  status: order.status,
  paymentMethod: order.payment_method,
  paymentStatus: order.payment_status,
  notes: order.notes,
  createdAt: order.created_at,
  updatedAt: order.updated_at
});

export const OrderService = {
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    try {
      // Try to insert into Supabase first
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            customer_id: orderData.customerId,
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,
            shipping_address: orderData.shippingAddress,
            items: orderData.items,
            total_amount: orderData.totalAmount,
            status: orderData.status,
            payment_method: orderData.paymentMethod,
            payment_status: orderData.paymentStatus,
            notes: orderData.notes
          })
          .select()
          .single();
          
        if (!error && data) {
          // Send order confirmation email
          try {
            await EmailService.sendOrderConfirmationEmail(
              orderData.customerEmail,
              orderData.customerName,
              data.id,
              orderData.totalAmount
            );
          } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
          }
          
          return mapToOrder(data);
        }
      } catch (dbError) {
        console.warn('Error creating order in Supabase:', dbError);
      }
      
      // Fall back to Neon database if Supabase fails
      const query = `
        INSERT INTO orders (
          customer_id, customer_name, customer_email, customer_phone,
          shipping_address, items, total_amount, status, 
          payment_method, payment_status, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      
      const params = [
        orderData.customerId,
        orderData.customerName,
        orderData.customerEmail,
        orderData.customerPhone,
        orderData.shippingAddress,
        orderData.items,
        orderData.totalAmount,
        orderData.status,
        orderData.paymentMethod,
        orderData.paymentStatus,
        orderData.notes
      ];
      
      const data = await executeQuery(query, params);
      
      // Send order confirmation email
      try {
        await EmailService.sendOrderConfirmationEmail(
          orderData.customerEmail,
          orderData.customerName,
          data[0].id,
          orderData.totalAmount
        );
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
      }
      
      return mapToOrder(data[0]);
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },
  
  getOrders: async (): Promise<Order[]> => {
    try {
      // Try to get from Supabase first
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          return data.map(mapToOrder);
        }
      } catch (dbError) {
        console.warn('Error getting orders from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const query = `
        SELECT * FROM orders
        ORDER BY created_at DESC
      `;
      
      const data = await executeQuery(query);
      return data.map(mapToOrder);
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  },
  
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      // Try to get from Supabase first
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();
          
        if (!error && data) {
          return mapToOrder(data);
        }
      } catch (dbError) {
        console.warn('Error getting order from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const query = 'SELECT * FROM orders WHERE id = $1';
      const data = await executeQuery(query, [id]);
      
      if (!data || data.length === 0) {
        return null;
      }
      
      return mapToOrder(data[0]);
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  },
  
  updateOrderStatus: async (id: string, status: Order['status']): Promise<boolean> => {
    try {
      // Try to update in Supabase first
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);
          
        if (!error) {
          return true;
        }
      } catch (dbError) {
        console.warn('Error updating order status in Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const query = `
        UPDATE orders 
        SET status = $1, updated_at = NOW() 
        WHERE id = $2
      `;
      
      await executeQuery(query, [status, id]);
      return true;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  },
  
  updatePaymentStatus: async (id: string, paymentStatus: Order['paymentStatus']): Promise<boolean> => {
    try {
      // Try to update in Supabase first
      try {
        const { error } = await supabase
          .from('orders')
          .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
          .eq('id', id);
          
        if (!error) {
          return true;
        }
      } catch (dbError) {
        console.warn('Error updating payment status in Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const query = `
        UPDATE orders 
        SET payment_status = $1, updated_at = NOW() 
        WHERE id = $2
      `;
      
      await executeQuery(query, [paymentStatus, id]);
      return true;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      throw error;
    }
  },
  
  deleteOrder: async (id: string): Promise<boolean> => {
    try {
      // Try to delete from Supabase first
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);
          
        if (!error) {
          return true;
        }
      } catch (dbError) {
        console.warn('Error deleting order from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const query = 'DELETE FROM orders WHERE id = $1';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      throw error;
    }
  },
  
  updateOrderNotes: async (id: string, notes: string): Promise<boolean> => {
    try {
      // Try to update in Supabase first
      try {
        const { error } = await supabase
          .from('orders')
          .update({ notes, updated_at: new Date().toISOString() })
          .eq('id', id);
          
        if (!error) {
          return true;
        }
      } catch (dbError) {
        console.warn('Error updating order notes in Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const query = `
        UPDATE orders 
        SET notes = $1, updated_at = NOW() 
        WHERE id = $2
      `;
      
      await executeQuery(query, [notes, id]);
      return true;
    } catch (error) {
      console.error('Error in updateOrderNotes:', error);
      throw error;
    }
  },
  
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      // Try to get from Supabase first
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          return data.map(mapToOrder);
        }
      } catch (dbError) {
        console.warn('Error getting orders by status from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const query = `
        SELECT * FROM orders 
        WHERE status = $1 
        ORDER BY created_at DESC
      `;
      
      const data = await executeQuery(query, [status]);
      return data.map(mapToOrder);
    } catch (error) {
      console.error('Error in getOrdersByStatus:', error);
      throw error;
    }
  },
  
  getOrdersByDateRange: async (startDate: Date, endDate: Date): Promise<Order[]> => {
    try {
      const query = `
        SELECT * FROM orders 
        WHERE created_at >= $1 AND created_at <= $2 
        ORDER BY created_at DESC
      `;
      
      const data = await executeQuery(query, [startDate.toISOString(), endDate.toISOString()]);
      return data.map(mapToOrder);
    } catch (error) {
      console.error('Error in getOrdersByDateRange:', error);
      throw error;
    }
  },
  
  bulkUpdateOrderStatus: async (ids: string[], status: Order['status']): Promise<boolean> => {
    try {
      if (!ids.length) return true;
      
      const placeholders = ids.map((_, i) => `$${i + 2}`).join(',');
      const query = `
        UPDATE orders 
        SET status = $1, updated_at = NOW() 
        WHERE id IN (${placeholders})
      `;
      
      await executeQuery(query, [status, ...ids]);
      return true;
    } catch (error) {
      console.error('Error in bulkUpdateOrderStatus:', error);
      throw error;
    }
  },
  
  bulkUpdatePaymentStatus: async (ids: string[], paymentStatus: Order['paymentStatus']): Promise<boolean> => {
    try {
      if (!ids.length) return true;
      
      const placeholders = ids.map((_, i) => `$${i + 2}`).join(',');
      const query = `
        UPDATE orders 
        SET payment_status = $1, updated_at = NOW() 
        WHERE id IN (${placeholders})
      `;
      
      await executeQuery(query, [paymentStatus, ...ids]);
      return true;
    } catch (error) {
      console.error('Error in bulkUpdatePaymentStatus:', error);
      throw error;
    }
  }
};
