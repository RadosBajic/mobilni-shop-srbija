
import { supabase } from '@/lib/supabase';

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

export const OrderService = {
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
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
      
      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }
      
      return {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        shippingAddress: data.shipping_address,
        items: data.items,
        totalAmount: data.total_amount,
        status: data.status,
        paymentMethod: data.payment_method,
        paymentStatus: data.payment_status,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },
  
  getOrders: async (): Promise<Order[]> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return data.map(order => ({
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
      }));
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  },
  
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching order by ID:', error);
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return {
        id: data.id,
        customerId: data.customer_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        shippingAddress: data.shipping_address,
        items: data.items,
        totalAmount: data.total_amount,
        status: data.status,
        paymentMethod: data.payment_method,
        paymentStatus: data.payment_status,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  },
  
  updateOrderStatus: async (id: string, status: Order['status']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  },
  
  updatePaymentStatus: async (id: string, paymentStatus: Order['paymentStatus']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      throw error;
    }
  },
  
  deleteOrder: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting order:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      throw error;
    }
  }
};
