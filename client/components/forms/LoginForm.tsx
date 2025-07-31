'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

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
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full px-3 py-2 border text-foreground border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            className="mt-1 block w-full px-3 py-2 border text-foreground border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoginLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
        >
          {isLoginLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="text-center">
          <Link href="/auth/signup" className="text-sm text-primary hover:text-primary/80">
            Don't have an account? Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

