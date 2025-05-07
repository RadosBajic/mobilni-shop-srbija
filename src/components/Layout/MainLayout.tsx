
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import MetaTags from '@/components/Layout/MetaTags';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  fullWidth = false,
  title,
  description,
  keywords,
  image,
}) => {
  return (
    <>
      <MetaTags
        title={title}
        description={description}
        keywords={keywords}
        image={image}
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <motion.main 
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {fullWidth ? (
            <>{children}</>
          ) : (
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          )}
        </motion.main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
