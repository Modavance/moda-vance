import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { Notifications } from '@/components/ui/Notifications';

export function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Notifications />
    </>
  );
}
