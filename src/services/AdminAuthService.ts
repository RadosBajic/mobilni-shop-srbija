
import { useToast } from "@/components/ui/use-toast";
import { createNotification } from "./NotificationService";
import { useNavigate } from "react-router-dom";

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'password';

export const AdminAuthService = {
  login: (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('adminAuthenticated');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  },

  useAdminAuth: () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    
    const login = async (username: string, password: string) => {
      if (AdminAuthService.login(username, password)) {
        await createNotification(
          "Login Successful", 
          "Welcome to the admin panel", 
          "success"
        );
        
        toast({
          title: "Uspešna prijava",
          description: "Dobrodošli u admin panel",
        });
        return true;
      }
      
      toast({
        title: "Neuspešna prijava",
        description: "Pogrešno korisničko ime ili lozinka",
        variant: "destructive",
      });
      return false;
    };
    
    const logout = () => {
      AdminAuthService.logout();
      createNotification(
        "Logout", 
        "You have been logged out successfully", 
        "info"
      );
      
      toast({
        title: "Odjavljeni ste",
        description: "Uspešno ste se odjavili",
      });
      
      navigate('/admin/login');
    };
    
    return {
      login,
      logout,
      isAuthenticated: AdminAuthService.isAuthenticated
    };
  }
};
