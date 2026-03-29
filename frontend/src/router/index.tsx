import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { TrackOrderPage } from '@/pages/TrackOrderPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AccountPage } from '@/pages/AccountPage';
import { AboutPage } from '@/pages/AboutPage';
import { FAQPage } from '@/pages/FAQPage';
import { ContactPage } from '@/pages/ContactPage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { TermsPage } from '@/pages/TermsPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from '@/pages/admin/AdminCouponsPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage';
import { AdminFAQPage } from '@/pages/admin/AdminFAQPage';
import { AdminContactPage } from '@/pages/admin/AdminContactPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage';
import { useAdminStore } from '@/store/adminStore';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'products/:slug', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'track', element: <TrackOrderPage /> },
      { path: 'order-confirmation/:orderId', element: <OrderSuccessPage /> },
      { path: 'orders/:orderId', element: <OrderDetailPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'customers', element: <AdminCustomersPage /> },
      { path: 'coupons', element: <AdminCouponsPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
      { path: 'blog', element: <AdminBlogPage /> },
      { path: 'faq', element: <AdminFAQPage /> },
      { path: 'contact', element: <AdminContactPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'profile', element: <AdminProfilePage /> },
    ],
  },
]);
