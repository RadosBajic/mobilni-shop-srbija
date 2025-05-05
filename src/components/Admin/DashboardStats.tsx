
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { setupDatabase, initializeDatabase } from '@/utils/setupDatabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStatsProps {}

const DashboardStats: React.FC<DashboardStatsProps> = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentSales: []
  });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected' | 'initialized'>('checking');

  useEffect(() => {
    checkDatabaseConnection();
    fetchDashboardStats();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      // Proveravamo stanje baze podataka
      const isReady = await setupDatabase();
      setDbStatus(isReady ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Error checking database connection:', error);
      setDbStatus('disconnected');
    }
  };

  const initializeDb = async () => {
    try {
      const success = await initializeDatabase();
      
      if (success) {
        toast({
          title: language === 'sr' ? 'Baza podataka inicijalizovana' : 'Database initialized',
          description: language === 'sr' 
            ? 'Baza podataka je uspešno inicijalizovana.' 
            : 'Database has been successfully initialized.',
        });
        
        setDbStatus('initialized');
        // Nakon inicijalizacije ponovo učitavamo podatke za kontrolnu tablu
        fetchDashboardStats();
      } else {
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Došlo je do greške pri inicijalizaciji baze podataka.' 
            : 'There was an error initializing the database.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Došlo je do greške pri inicijalizaciji baze podataka.' 
          : 'There was an error initializing the database.',
        variant: 'destructive'
      });
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Učitavamo proizvode
      const products = await api.getProducts();
      
      // Učitavamo porudžbine
      const orders = await api.getOrders();
      
      // Računamo ukupan prihod
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);
      
      // Generišemo podatke o nedavnim prodajama za grafikon
      // U stvarnom projektu, ovo bi uključivalo stvarne podatke iz baze
      const recentSales = generateRecentSalesData(orders);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        recentSales
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pomoćna funkcija za generisanje podataka o nedavnim prodajama
  const generateRecentSalesData = (orders: any[]) => {
    // Pojednostavljeni pristup za demo
    // U pravom projektu, ovo bi trebalo da budu stvarni podaci o prodaji po danima
    
    // Kreiranje praznog niza za poslednjih 7 dana
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', { weekday: 'short' }),
        amount: 0,
        orders: 0
      };
    });
    
    // Popunjavanje podacima iz porudžbina
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      // Samo porudžbine iz poslednjih 7 dana
      if ((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24) < 7) {
        const dayIndex = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
          const reversedIndex = 6 - dayIndex; // preokrenutni indeks
          last7Days[reversedIndex].amount += Number(order.total_amount);
          last7Days[reversedIndex].orders += 1;
        }
      }
    });
    
    return last7Days;
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Database Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'sr' ? 'Status baze podataka' : 'Database Status'}
          </CardTitle>
          {dbStatus === 'connected' || dbStatus === 'initialized' ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {dbStatus === 'checking' && (language === 'sr' ? 'Provera...' : 'Checking...')}
              {dbStatus === 'connected' && (language === 'sr' ? 'Povezano' : 'Connected')}
              {dbStatus === 'initialized' && (language === 'sr' ? 'Inicijalizovano' : 'Initialized')}
              {dbStatus === 'disconnected' && (language === 'sr' ? 'Nije povezano' : 'Disconnected')}
            </div>
            {dbStatus === 'disconnected' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={initializeDb}
                className="w-full"
              >
                {language === 'sr' ? 'Inicijalizuj bazu' : 'Initialize Database'}
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              {dbStatus === 'connected' || dbStatus === 'initialized' 
                ? (language === 'sr' ? 'Baza podataka je spremna.' : 'Database is ready.') 
                : (language === 'sr' ? 'Povežite se sa bazom podataka.' : 'Connect to the database.')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'sr' ? 'Ukupan prihod' : 'Total Revenue'}
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '...' : `${stats.totalRevenue.toLocaleString()} RSD`}
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'sr' ? 'Ukupan prihod od svih porudžbina' : 'Total revenue from all orders'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'sr' ? 'Porudžbine' : 'Orders'}
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '...' : stats.totalOrders}
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'sr' ? 'Ukupan broj porudžbina' : 'Total number of orders'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'sr' ? 'Proizvodi' : 'Products'}
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '...' : stats.totalProducts}
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'sr' ? 'Ukupan broj proizvoda' : 'Total number of products'}
          </p>
        </CardContent>
      </Card>

      {/* Sales Chart Card */}
      <Card className="col-span-1 sm:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>{language === 'sr' ? 'Nedavne prodaje' : 'Recent Sales'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <p>{language === 'sr' ? 'Učitavanje...' : 'Loading...'}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats.recentSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} RSD`, language === 'sr' ? 'Prihod' : 'Revenue']}
                  labelFormatter={(label) => language === 'sr' ? `Dan: ${label}` : `Day: ${label}`}
                />
                <Bar dataKey="amount" fill="#3b82f6" name={language === 'sr' ? 'Prihod' : 'Revenue'} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
