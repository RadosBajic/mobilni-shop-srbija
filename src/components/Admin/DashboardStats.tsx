
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon }) => {
  return (
    <Card className="hover-lift transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  refreshTrigger?: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ refreshTrigger = 0 }) => {
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get orders
        const orders = await api.getOrders();
        
        // Get customers
        const customers = await api.getCustomers();
        
        // Get products
        const products = await api.getProducts();
        
        // Calculate total revenue from orders
        const revenue = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);
        
        setStats({
          orders: orders.length,
          revenue: revenue,
          customers: customers.length,
          products: products.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [refreshTrigger]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'sr' ? 'sr-RS' : 'en-US', { 
      style: 'currency',
      currency: 'RSD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hover-lift transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <div className="h-5 w-5 bg-muted rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title={language === 'sr' ? 'Porudžbine' : 'Orders'}
        value={stats.orders.toString()}
        icon={ShoppingCart}
        description={language === 'sr' ? 'Ukupno porudžbina' : 'Total orders'} 
      />
      <StatCard 
        title={language === 'sr' ? 'Prihodi' : 'Revenue'}
        value={formatCurrency(stats.revenue)}
        icon={DollarSign}
        description={language === 'sr' ? 'Ukupni prihodi' : 'Total revenue'} 
      />
      <StatCard 
        title={language === 'sr' ? 'Kupci' : 'Customers'}
        value={stats.customers.toString()}
        icon={Users}
        description={language === 'sr' ? 'Registrovani kupci' : 'Registered customers'} 
      />
      <StatCard 
        title={language === 'sr' ? 'Proizvodi' : 'Products'}
        value={stats.products.toString()}
        icon={Package}
        description={language === 'sr' ? 'Aktivni proizvodi' : 'Active products'} 
      />
    </div>
  );
};

export default DashboardStats;
