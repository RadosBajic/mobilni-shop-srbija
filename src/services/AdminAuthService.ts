
import { useToast } from "@/components/ui/use-toast";

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'password123';

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
    
    const login = async (username: string, password: string) => {
      if (AdminAuthService.login(username, password)) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel",
        });
        return true;
      }
      
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    };
    
    const logout = () => {
      AdminAuthService.logout();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    };
    
    return {
      login,
      logout,
      isAuthenticated: AdminAuthService.isAuthenticated
    };
  }
};
