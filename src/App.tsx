
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Loading from './components/ui/loading';
import ErrorBoundary from './components/ui/error-boundary';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { isAdminAuthenticated } from '@/utils/auth';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const CategoryProducts = lazy(() => import('./pages/CategoryProducts'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Page404 = lazy(() => import('./pages/404'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/Products'));
const AdminCategories = lazy(() => import('./pages/Admin/Categories'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminOrderDetails = lazy(() => import('./pages/Admin/OrderDetails'));
const AdminBanners = lazy(() => import('./pages/Admin/Banners'));
const AdminPromotions = lazy(() => import('./pages/Admin/Promotions'));
const AdminCustomers = lazy(() => import('./pages/Admin/Customers'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));
const AdminNotifications = lazy(() => import('./pages/Admin/Notifications'));
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics'));
const AdminEmailSettings = lazy(() => import('./pages/Admin/EmailSettings'));

// AdminRoute komponenta za zaštitu admin ruta
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = isAdminAuthenticated();
        
        if (!authenticated && location.pathname !== '/admin/login') {
          navigate('/admin/login');
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error('Greška pri proveri autentikacije:', error);
        navigate('/admin/login');
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [location.pathname, navigate]);

  if (isChecking) {
    return <Loading />;
  }
  
  return <>{children}</>;
};

function App() {
  // Koristimo zaštićene admin rute
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Javne rute */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryProducts />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Admin rute */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Zaštićene admin rute */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetails /></AdminRoute>} />
            <Route path="/admin/banners" element={<AdminRoute><AdminBanners /></AdminRoute>} />
            <Route path="/admin/promotions" element={<AdminRoute><AdminPromotions /></AdminRoute>} />
            <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/email-settings" element={<AdminRoute><AdminEmailSettings /></AdminRoute>} />
            
            {/* 404 ruta */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      
      <Toaster />
    </>
  );
}

export default App;
