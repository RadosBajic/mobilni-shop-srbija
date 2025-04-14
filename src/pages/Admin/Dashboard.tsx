import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { setupDatabase } from '@/utils/setupDatabase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useLanguage();
  const [databaseReady, setDatabaseReady] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkDatabase = async () => {
      const isReady = await setupDatabase();
      setDatabaseReady(isReady);
    };
    
    checkDatabase();
  }, []);
  
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
      
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Orders"
          value="156"
          description="Total orders this month"
          trend={{ value: '+12%', positive: true }}
          icon={ShoppingCart}
        />
        <StatCard 
          title="Revenue"
          value="289,500 RSD"
          description="Total revenue this month"
          trend={{ value: '+23%', positive: true }}
          icon={DollarSign}
        />
        <StatCard 
          title="Customers"
          value="2,345"
          description="Active customers"
          trend={{ value: '+8%', positive: true }}
          icon={Users}
        />
        <StatCard 
          title="Products"
          value="586"
          description="Total products"
          trend={{ value: '-3%', positive: false }}
          icon={Package}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift transition-all">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
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
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Sales by product category</CardDescription>
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
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="hover-lift transition-all">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performers this month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProductsData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 120,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(value) => `${value} units`} />
                <Legend />
                <Bar dataKey="units" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent orders */}
      <Card className="hover-lift transition-all">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                  <th className="text-right py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">#{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4 text-right">{order.amount} RSD</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Stat card component
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend }) => {
  return (
    <Card className="hover-lift transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${
            trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.positive ? 
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> : 
              <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
            }
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Sample data for recent orders
const recentOrders = [
  { id: '28741', customer: 'Marko Petrović', date: '06.04.2025', amount: '12,890', status: 'Completed' },
  { id: '28740', customer: 'Ana Jovanović', date: '05.04.2025', amount: '8,450', status: 'Processing' },
  { id: '28739', customer: 'Stefan Nikolić', date: '05.04.2025', amount: '5,670', status: 'Pending' },
  { id: '28738', customer: 'Jelena Đorđević', date: '04.04.2025', amount: '3,290', status: 'Completed' },
  { id: '28737', customer: 'Milan Todorović', date: '04.04.2025', amount: '7,890', status: 'Processing' },
];

// Sample data for sales chart
const salesData = [
  { month: 'Nov', revenue: 154600 },
  { month: 'Dec', revenue: 211400 },
  { month: 'Jan', revenue: 178500 },
  { month: 'Feb', revenue: 199300 },
  { month: 'Mar', revenue: 235800 },
  { month: 'Apr', revenue: 289500 },
];

// Sample data for categories pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6347'];

const categoryData = [
  { name: 'Phone Cases', value: 245 },
  { name: 'Screen Protectors', value: 167 },
  { name: 'Chargers', value: 134 },
  { name: 'Cables', value: 98 },
  { name: 'Headphones', value: 76 },
  { name: 'Other', value: 43 },
];

// Sample data for top products bar chart
const topProductsData = [
  { name: 'iPhone 14 Pro Case - Black', units: 67 },
  { name: 'Samsung S23 Screen Protector', units: 54 },
  { name: 'USB-C Fast Charger 65W', units: 42 },
  { name: 'Bluetooth Earbuds', units: 38 },
  { name: 'Lightning Cable - 2m', units: 31 },
];

export default Dashboard;
