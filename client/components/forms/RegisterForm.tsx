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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['reader', 'author', 'admin']).optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register: registerUser, isRegisterLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'author'
    }
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">Join BlogSpace</CardTitle>
          <CardDescription className="text-sm">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Username
              </Label>
              <Input
                {...register('username')}
                id="username"
                type="text"
                placeholder="Enter username"
                className="h-9"
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email
              </Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="Enter email"
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
                placeholder="Create password"
                className="h-9"
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Role
              </Label>
              <Select onValueChange={(value) => setValue('role', value as 'reader' | 'author')}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="reader">Reader</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isRegisterLoading}
              className="w-full h-9"
            >
              {isRegisterLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}