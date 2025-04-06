
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ScrollArea className="flex-1">
        <main className={cn(
          "flex-grow py-6",
          fullWidth ? "" : "container",
          className
        )}>
          {children}
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default MainLayout;
