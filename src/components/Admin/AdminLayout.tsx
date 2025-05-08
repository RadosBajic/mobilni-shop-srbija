import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Box,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Image,
  Bell,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationsDropdown from './NotificationsDropdown';
import { logout } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigationItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Orders',
      href: '/admin/orders',
    },
    {
      icon: <Box className="h-5 w-5" />,
      label: 'Products',
      href: '/admin/products',
    },
    {
      icon: <Tag className="h-5 w-5" />,
      label: 'Categories',
      href: '/admin/categories',
    },
    {
      icon: <Image className="h-5 w-5" />,
      label: 'Banners',
      href: '/admin/banners',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Customers',
      href: '/admin/customers',
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Analytics',
      href: '/admin/analytics',
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: 'Notifications',
      href: '/admin/notifications',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email Settings',
      href: '/admin/email-settings',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      href: '/admin/settings',
    },
  ];

  const handleLogout = async () => {
    logout();
    toast({
      title: "Odjava uspešna",
      description: "Uspešno ste se odjavili iz admin panela"
    });
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-background z-30 flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="font-bold">MobiShop Admin</div>
        <div className="flex items-center space-x-2">
          <NotificationsDropdown />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-3/4 sm:w-64 lg:w-64 bg-background shadow-lg lg:shadow-none lg:relative lg:block transition-transform lg:translate-x-0 border-r ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 font-bold text-xl flex items-center justify-between">
            <Link to="/admin/dashboard">MobiShop Admin</Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href} 
                  to={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <div
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <Separator />
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </Button>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:underline">
                Visit Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col pt-[73px] lg:pt-0">
        {/* Desktop header */}
        <header className="border-b hidden lg:flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">
            {navigationItems.find((item) => item.href === location.pathname)
              ?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
