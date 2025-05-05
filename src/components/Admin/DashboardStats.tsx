
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, DollarSign, Users, Package, Database } from 'lucide-react';
import { setupDatabase, initializeDatabase } from '@/utils/setupDatabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'not-ready'>('checking');
  const [initializing, setInitializing] = useState(false);

  // Provera stanja baze podataka
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const isReady = await setupDatabase();
        setDbStatus(isReady ? 'ready' : 'not-ready');
      } catch (error) {
        console.error('Error checking database:', error);
        setDbStatus('not-ready');
      }
    };
    
    checkDatabase();
  }, [refreshTrigger]);

  // Inicijalizacija baze podataka
  const handleInitializeDb = async () => {
    try {
      setInitializing(true);
      
      const result = await initializeDatabase();
      
      if (result) {
        setDbStatus('ready');
        toast({
          title: language === 'sr' ? 'Uspeh' : 'Success',
          description: language === 'sr' 
            ? 'Baza podataka je uspešno inicijalizovana'
            : 'Database has been successfully initialized',
        });
      } else {
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Inicijalizacija baze podataka nije uspela'
            : 'Database initialization failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      // Samo pokušavamo da dohvatimo statistiku ako je baza spremna
      if (dbStatus !== 'ready') {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Dobijamo porudžbine
        const orders = await api.getOrders();
        
        // Dobijamo kupce
        const customers = await api.getCustomers();
        
        // Dobijamo proizvode
        const products = await api.getProducts();
        
        // Izračunavamo ukupan prihod od porudžbina
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
  }, [refreshTrigger, dbStatus]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'sr' ? 'sr-RS' : 'en-US', { 
      style: 'currency',
      currency: 'RSD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // UI za stanje baze podataka
  if (dbStatus !== 'ready') {
    return (
      <div className="space-y-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-800">
                  {language === 'sr' ? 'Baza podataka nije spremna' : 'Database is not ready'}
                </h2>
                <p className="text-sm text-amber-700 mt-1">
                  {language === 'sr' 
                    ? 'Potrebne tabele nisu pronađene u bazi podataka. Pokrenite inicijalizaciju baze.'
                    : 'Required tables were not found in the database. Initialize the database.'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                onClick={handleInitializeDb} 
                disabled={initializing}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {initializing
                  ? (language === 'sr' ? 'Inicijalizacija...' : 'Initializing...')
                  : (language === 'sr' ? 'Inicijalizuj bazu podataka' : 'Initialize database')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
