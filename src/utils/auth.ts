
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { createNotification } from '@/services/NotificationService';

interface UseAdminAuthOptions {
  redirectTo?: string;
  shouldRedirect?: boolean;
}

export const useAdminAuth = (options: UseAdminAuthOptions = {}) => {
  const { 
    redirectTo = '/admin/login',
    shouldRedirect = true 
  } = options;
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // U pravoj aplikaciji, ovo bi proverilo sa backend API-jem
        // Za ovu demo aplikaciju koristimo localStorage
        const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
        
        setIsAuthenticated(authenticated);
        
        if (!authenticated && shouldRedirect) {
          toast({
            title: "Potrebna autentikacija",
            description: "Molimo prijavite se za pristup admin panelu",
            variant: "destructive",
          });
          navigate(redirectTo);
        }
      } catch (error) {
        console.error('Provera autentikacije neuspešna:', error);
        setIsAuthenticated(false);
        
        if (shouldRedirect) {
          toast({
            title: "Greška pri autentikaciji",
            description: "Molimo prijavite se ponovo",
            variant: "destructive",
          });
          navigate(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, redirectTo, shouldRedirect, toast]);
  
  return { isAuthenticated, isLoading };
};

export const login = (username: string, password: string): Promise<boolean> => {
  // U pravoj aplikaciji, ovo bi napravilo API zahtev za validaciju kredencijala
  return new Promise((resolve) => {
    setTimeout(() => {
      // Demo validacija - u pravoj aplikaciji ovo bi bilo obrađeno na serveru
      if (username === 'admin' && password === 'password') {
        localStorage.setItem('adminAuthenticated', 'true');
        // Kreiraj obaveštenje o uspešnoj prijavi
        createNotification(
          "Uspešna prijava", 
          "Uspešno ste se prijavili na admin panel", 
          "success"
        );
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

export const logout = () => {
  localStorage.removeItem('adminAuthenticated');
  createNotification(
    "Odjava", 
    "Uspešno ste se odjavili sa admin panela", 
    "info"
  );
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('adminAuthenticated') === 'true';
};
