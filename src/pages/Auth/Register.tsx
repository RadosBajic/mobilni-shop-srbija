
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/Layout/MainLayout';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();

  const translations = {
    title: {
      sr: 'Registracija',
      en: 'Register'
    },
    description: {
      sr: 'Kreirajte vaš nalog',
      en: 'Create your account'
    },
    email: {
      sr: 'Email adresa',
      en: 'Email address'
    },
    password: {
      sr: 'Lozinka',
      en: 'Password'
    },
    confirmPassword: {
      sr: 'Potvrdi lozinku',
      en: 'Confirm password'
    },
    submit: {
      sr: 'Registruj se',
      en: 'Register'
    },
    login: {
      sr: 'Već imate nalog? Prijavite se',
      en: 'Already have an account? Sign in'
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      return;
    }

    try {
      await signUp(data.email, data.password);
      navigate('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
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

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {translations.confirmPassword[language]}
                </label>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    required: true,
                    validate: (val: string) => {
                      if (watch('password') != val) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
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
                onClick={() => navigate('/auth/login')}
              >
                {translations.login[language]}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Register;
