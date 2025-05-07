
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Loading from './components/ui/loading';
import ErrorBoundary from './components/ui/error-boundary';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

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

function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');
  
  // Redirect non-authenticated users from admin sections
  useEffect(() => {
    if (!authLoading && !isAuthenticated && isAdmin && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isAdmin, location.pathname, authLoading, navigate]);
  
  // Fallback for loading state
  if (authLoading && isAdmin && location.pathname !== '/admin/login') {
    return <Loading />;
  }

  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryProducts />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Admin routes - protected by authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Navigate to="/admin/login" />
              }
            />
            <Route
              path="/admin/dashboard"
              element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/products"
              element={isAuthenticated ? <AdminProducts /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/categories"
              element={isAuthenticated ? <AdminCategories /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/orders"
              element={isAuthenticated ? <AdminOrders /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/orders/:id"
              element={isAuthenticated ? <AdminOrderDetails /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/banners"
              element={isAuthenticated ? <AdminBanners /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/promotions"
              element={isAuthenticated ? <AdminPromotions /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/customers"
              element={isAuthenticated ? <AdminCustomers /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/settings"
              element={isAuthenticated ? <AdminSettings /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/notifications"
              element={isAuthenticated ? <AdminNotifications /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/analytics"
              element={isAuthenticated ? <AdminAnalytics /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/email-settings"
              element={isAuthenticated ? <AdminEmailSettings /> : <Navigate to="/admin/login" />}
            />
            
            {/* 404 route */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      
      <Toaster />
      <Analytics />
    </>
  );
}

export default App;
