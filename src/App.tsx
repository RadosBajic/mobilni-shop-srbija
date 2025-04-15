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
import { isSupabaseConfigured } from "@/lib/supabase";

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

// Protected Route component
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

const App = () => {
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean>(false);

  useEffect(() => {
    // Check if Supabase is configured on component mount
    const checkSupabase = () => {
      const configured = isSupabaseConfigured();
      setIsSupabaseReady(configured);
      
      if (!configured) {
        console.error("Supabase is not properly configured. Check your environment variables.");
      }
    };
    
    checkSupabase();
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
                    
                    {/* Protected admin routes */}
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
