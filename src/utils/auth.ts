
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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
        // In a real app, this would verify with a backend API
        // For this demo, we're using localStorage
        const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
        
        setIsAuthenticated(authenticated);
        
        if (!authenticated && shouldRedirect) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin panel",
            variant: "destructive",
          });
          navigate(redirectTo);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        
        if (shouldRedirect) {
          toast({
            title: "Authentication error",
            description: "Please log in again",
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
  // In a real app, this would make an API request to validate credentials
  return new Promise((resolve) => {
    setTimeout(() => {
      // Demo validation - in a real app this would be handled by the server
      if (username === 'admin' && password === 'password') {
        localStorage.setItem('adminAuthenticated', 'true');
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

export const logout = () => {
  localStorage.removeItem('adminAuthenticated');
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('adminAuthenticated') === 'true';
};
