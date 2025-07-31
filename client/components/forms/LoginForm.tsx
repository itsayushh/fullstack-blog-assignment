'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoginLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <LogIn className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-sm">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email
              </Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-9"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Password
              </Label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-9"
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoginLoading}
              className="w-full h-9"
            >
              {isLoginLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

