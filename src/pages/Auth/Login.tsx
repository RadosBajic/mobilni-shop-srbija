
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/Layout/MainLayout';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  const translations = {
    title: {
      sr: 'Prijava',
      en: 'Sign In'
    },
    description: {
      sr: 'Unesite vaše podatke za prijavu',
      en: 'Enter your credentials to sign in'
    },
    email: {
      sr: 'Email adresa',
      en: 'Email address'
    },
    password: {
      sr: 'Lozinka',
      en: 'Password'
    },
    submit: {
      sr: 'Prijavi se',
      en: 'Sign in'
    },
    register: {
      sr: 'Nemate nalog? Registrujte se',
      en: 'Don\'t have an account? Register'
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{translations.title[language]}</CardTitle>
            <CardDescription>{translations.description[language]}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {translations.email[language]}
                </label>
                <Input
                  type="email"
                  {...register('email', { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {translations.password[language]}
                </label>
                <Input
                  type="password"
                  {...register('password', { required: true })}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    {translations.submit[language]}...
                  </div>
                ) : translations.submit[language]}
              </Button>
              
              <Button 
                variant="link" 
                className="w-full"
                onClick={() => navigate('/auth/register')}
              >
                {translations.register[language]}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
