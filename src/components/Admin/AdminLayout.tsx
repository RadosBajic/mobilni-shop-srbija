
import React from 'react';
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
  ShoppingBag, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth, logout } from '@/utils/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Check authentication on mount
  const { isAuthenticated, isLoading } = useAdminAuth();

  const handleLogout = () => {
    logout();
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

  const Sidebar = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">M</span>
          </div>
          <h1 className="text-xl font-bold text-primary">MobShop Admin</h1>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4 py-2">
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-secondary-foreground/10 hover:text-foreground'
                    }`}
                    onClick={() => isMobile && setMobileSidebarOpen(false)}
                  >
                    <item.icon size={18} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea>
      
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
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The useAdminAuth hook will redirect if not authenticated
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:block">
        <Sidebar />
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-card border-b border-border p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              
              <h1 className="text-lg font-bold">MobShop Admin</h1>
            </div>
            
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
