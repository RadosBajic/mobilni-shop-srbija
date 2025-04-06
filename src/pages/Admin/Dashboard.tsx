
import React from 'react';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
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
      
      {/* Recent orders */}
      <Card>
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
                  <tr key={order.id} className="border-b">
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
    <Card>
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

export default Dashboard;
