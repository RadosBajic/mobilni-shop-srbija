
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { isNeonConfigured } from '@/lib/neon';

export const SupabaseStatus: React.FC = () => {
  const { language } = useLanguage();
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  
  useEffect(() => {
    async function checkConnection() {
      try {
        const configStatus = isNeonConfigured();
        setIsConfigured(configStatus);
      } catch (error) {
        console.error('Database configuration error:', error);
        setIsConfigured(false);
      }
    }
    
    checkConnection();
  }, []);
  
  if (isConfigured) {
    return null; // Ne prikazujemo ništa ako je konfiguracija ispravna
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {language === 'sr' ? 'Greška u konfiguraciji' : 'Configuration Error'}
      </AlertTitle>
      <AlertDescription>
        {language === 'sr' 
          ? 'Veza sa bazom podataka nije ispravno konfigurisana. Proverite podešavanja.'
          : 'Database connection is not properly configured. Please check your settings.'}
      </AlertDescription>
    </Alert>
  );
};
