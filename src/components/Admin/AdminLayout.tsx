
import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  FileSpreadsheet, 
  Settings, 
  Users, 
  BarChart3, 
  LogOut, 
  ShoppingBag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Tag, label: 'Categories', path: '/admin/categories' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: FileSpreadsheet, label: 'Import/Export', path: '/admin/import-export' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-border hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">MobShop Admin</h1>
        </div>
        
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-2 rounded-md text-muted-foreground hover:bg-secondary-foreground/10 hover:text-foreground transition-colors"
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto p-4 border-t border-border/60">
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-card border-b border-border p-4 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">MobShop Admin</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
