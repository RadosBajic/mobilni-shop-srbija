
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  return { isAuthenticated: localStorage.getItem('adminAuthenticated') === 'true' };
};

export const logout = () => {
  localStorage.removeItem('adminAuthenticated');
};
