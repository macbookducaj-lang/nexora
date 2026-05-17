import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { MobileCartBar } from './MobileCartBar';

interface LayoutProps {
  onAuthClick: () => void;
}

export function Layout({ onAuthClick }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header onAuthClick={onAuthClick} />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileCartBar />
    </div>
  );
}
