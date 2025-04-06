
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import MainLayout from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { language } = useLanguage();
  
  const content = {
    title: {
      sr: '404 - Stranica nije pronađena',
      en: '404 - Page Not Found',
    },
    description: {
      sr: 'Stranica koju tražite ne postoji ili je premeštena.',
      en: 'The page you are looking for does not exist or has been moved.',
    },
    button: {
      sr: 'Nazad na početnu',
      en: 'Back to Home',
    },
  };

  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-6 text-2xl font-bold">
          {content.title[language]}
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          {content.description[language]}
        </p>
        <Button asChild className="mt-8">
          <Link to="/">{content.button[language]}</Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFound;
