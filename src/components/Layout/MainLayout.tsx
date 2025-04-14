
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { SupabaseStatus } from '@/components/SupabaseStatus';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, fullWidth }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-grow ${fullWidth ? '' : 'container mx-auto px-4'}`}>
        <SupabaseStatus />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
