
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export const SupabaseStatus: React.FC = () => {
  const { language } = useLanguage();
  const isConfigured = isSupabaseConfigured();
  
  if (isConfigured) {
    return null; // Don't show anything if configured properly
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {language === 'sr' ? 'Greška u konfiguraciji' : 'Configuration Error'}
      </AlertTitle>
      <AlertDescription>
        {language === 'sr' 
          ? 'Supabase veza nije ispravno konfigurisana. Proverite podešavanja.'
          : 'Supabase connection is not properly configured. Please check your settings.'}
      </AlertDescription>
    </Alert>
  );
};
