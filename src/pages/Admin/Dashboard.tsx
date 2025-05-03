
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { setupDatabase } from '@/utils/setupDatabase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from 'lucide-react';
import DashboardStats from '@/components/Admin/DashboardStats';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '@/lib/api';

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [databaseReady, setDatabaseReady] = useState<boolean | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkDatabase = async () => {
      const isReady = await setupDatabase();
      setDatabaseReady(isReady);
      
      if (isReady) {
        fetchDashboardData();
      } else {
        setLoading(false);
      }
    };
    
    checkDatabase();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      // Fetch recent orders
      const orders = await api.getOrders();
      
      // Format orders for display
      const formattedOrders = orders.slice(0, 5).map((order: any) => ({
        id: order.id.substring(0, 8),
        customer: order.customer_name,
        date: new Date(order.created_at).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US'),
        amount: Number(order.total_amount).toLocaleString() + ' RSD',
        status: mapOrderStatus(order.status)
      }));
      
      setRecentOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const mapOrderStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return language === 'sr' ? 'Završeno' : 'Completed';
      case 'processing':
        return language === 'sr' ? 'U obradi' : 'Processing';
      case 'shipped':
        return language === 'sr' ? 'Poslato' : 'Shipped';
      case 'cancelled':
        return language === 'sr' ? 'Otkazano' : 'Cancelled';
      default:
        return language === 'sr' ? 'Na čekanju' : 'Pending';
    }
  };
  
  // Sample data for charts (in a real app, this would come from API)
  const salesData = [
    { month: 'Nov', revenue: 154600 },
    { month: 'Dec', revenue: 211400 },
    { month: 'Jan', revenue: 178500 },
    { month: 'Feb', revenue: 199300 },
    { month: 'Mar', revenue: 235800 },
    { month: 'Apr', revenue: 289500 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6347'];

  const categoryData = [
    { name: language === 'sr' ? 'Maske za telefone' : 'Phone Cases', value: 245 },
    { name: language === 'sr' ? 'Zaštita ekrana' : 'Screen Protectors', value: 167 },
    { name: language === 'sr' ? 'Punjači' : 'Chargers', value: 134 },
    { name: language === 'sr' ? 'Kablovi' : 'Cables', value: 98 },
    { name: language === 'sr' ? 'Slušalice' : 'Headphones', value: 76 },
    { name: language === 'sr' ? 'Ostalo' : 'Other', value: 43 },
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {language === 'sr' ? 'Kontrolna tabla' : 'Dashboard'}
      </h1>
      
      {databaseReady === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'sr' ? 'Baza podataka nije spremna' : 'Database Not Ready'}
          </AlertTitle>
          <AlertDescription>
            {language === 'sr' 
              ? 'Potrebne tabele nisu pronađene u bazi podataka. Pokrenite SQL skriptu za kreiranje tabela.'
              : 'Required tables were not found in the database. Please run the SQL script to create tables.'}
          </AlertDescription>
        </Alert>
      )}
      
      {databaseReady === true && (
        <Alert variant="default" className="border-green-500 mb-4">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>
            {language === 'sr' ? 'Baza podataka je spremna' : 'Database Ready'}
          </AlertTitle>
          <AlertDescription>
            {language === 'sr' 
              ? 'Sve potrebne tabele su pronađene u bazi podataka.'
              : 'All required tables were found in the database.'}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Real-time stats from database */}
      {databaseReady === true && <DashboardStats />}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift transition-all">
          <CardHeader>
            <CardTitle>{language === 'sr' ? 'Pregled prodaje' : 'Sales Overview'}</CardTitle>
            <CardDescription>
              {language === 'sr' 
                ? 'Mesečni prihodi za poslednjih 6 meseci' 
                : 'Monthly revenue for the last 6 months'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} RSD`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="hover-lift transition-all">
          <CardHeader>
            <CardTitle>
              {language === 'sr' ? 'Kategorije proizvoda' : 'Product Categories'}
            </CardTitle>
            <CardDescription>
              {language === 'sr' ? 'Prodaje po kategoriji proizvoda' : 'Sales by product category'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} items`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent orders */}
      <Card className="hover-lift transition-all">
        <CardHeader>
          <CardTitle>{language === 'sr' ? 'Nedavne porudžbine' : 'Recent Orders'}</CardTitle>
          <CardDescription>
            {language === 'sr' ? 'Najnovije porudžbine kupaca' : 'Latest orders from customers'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      {language === 'sr' ? 'ID porudžbine' : 'Order ID'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      {language === 'sr' ? 'Kupac' : 'Customer'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      {language === 'sr' ? 'Datum' : 'Date'}
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      {language === 'sr' ? 'Iznos' : 'Amount'}
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      {language === 'sr' ? 'Status' : 'Status'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">#{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.date}</td>
                        <td className="py-3 px-4 text-right">{order.amount}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Completed' || order.status === 'Završeno' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'Processing' || order.status === 'U obradi' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        {language === 'sr' ? 'Nema porudžbina za prikaz' : 'No orders to display'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
