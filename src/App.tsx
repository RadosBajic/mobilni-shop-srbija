import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { isNeonConfigured } from "@/lib/neon";
import { AdminAuthService } from "@/services/AdminAuthService";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";

// Admin pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import { default as AdminProducts } from "./pages/Admin/Products";
import Categories from "./pages/Admin/Categories";
import Orders from "./pages/Admin/Orders";
import ImportExport from "./pages/Admin/ImportExport";
import Banners from "./pages/Admin/Banners";
import Settings from "./pages/Admin/Settings";
import Customers from "./pages/Admin/Customers";
import MailPage from "./pages/Admin/Mail";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

const queryClient = new QueryClient();

// Protected Route component for regular users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  
  return <>{children}</>;
};

// Protected Route component for admin users
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AdminAuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isDatabaseReady, setIsDatabaseReady] = useState<boolean>(false);

  useEffect(() => {
    const checkDatabase = () => {
      const configured = isNeonConfigured();
      setIsDatabaseReady(configured);
      
      if (!configured) {
        console.error("Database is not properly configured. Check your connection string.");
      }
    };
    
    checkDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/proizvodi" element={<Products />} />
                    <Route path="/proizvod/:id" element={<ProductDetail />} />
                    <Route path="/kontakt" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    
                    {/* Auth routes */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    
                    {/* Admin auth route - this should NOT be protected */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Protected admin routes */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route 
                      path="/admin/*" 
                      element={
                        <AdminProtectedRoute>
                          <AdminLayout />
                        </AdminProtectedRoute>
                      }
                    >
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="banners" element={<Banners />} />
                      <Route path="mail" element={<MailPage />} />
                      <Route path="import-export" element={<ImportExport />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                    
                    {/* 404 catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
