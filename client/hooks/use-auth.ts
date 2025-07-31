'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    enabled: !!Cookies.get('auth-token'),
    retry: false,
  });

  const user = userData?.user;

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      Cookies.set('auth-token', data.token, { expires: 7 });
      queryClient.setQueryData(['auth', 'me'], { user: data.user });
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password, role }: { 
      username: string; 
      email: string; 
      password: string; 
      role?: string;
    }) => authService.register(username, email, password, role),
    onSuccess: (data) => {
      Cookies.set('auth-token', data.token, { expires: 7 });
      queryClient.setQueryData(['auth', 'me'], { user: data.user });
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ username, bio, avatar }: { username?: string; bio?: string; avatar?: string }) =>
      authService.updateProfile(username, bio, avatar),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], { user: data.user });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Profile update failed');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(currentPassword, newPassword),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Password change failed');
    },
  });

  const logout = () => {
    Cookies.remove('auth-token');
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    queryClient.removeQueries({ queryKey: ['auth', 'me'] });
    router.push('/');
    toast.success('Logged out successfully!');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
}