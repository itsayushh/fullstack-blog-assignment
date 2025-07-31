'use client';

import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield } from 'lucide-react';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters'),
  avatar: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, isLoading, updateProfile, changePassword, isUpdatingProfile, isChangingPassword } = useAuth();
  const router = useRouter();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfile(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    passwordForm.reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-medium text-card-foreground">{user.username}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-secondary/20 text-secondary-foreground'
                    : user.role === 'author'
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Form */}
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Profile Information</h2>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Username</label>
                <input
                  {...profileForm.register('username')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
                />
                {profileForm.formState.errors.username && (
                  <p className="mt-1 text-sm text-destructive">{profileForm.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Bio</label>
                <textarea
                  {...profileForm.register('bio')}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
                  placeholder="Tell us about yourself..."
                />
                {profileForm.formState.errors.bio && (
                  <p className="mt-1 text-sm text-destructive">{profileForm.formState.errors.bio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Avatar URL</label>
                <input
                  {...profileForm.register('avatar')}
                  type="url"
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
                  placeholder="https://example.com/avatar.jpg"
                />
                {profileForm.formState.errors.avatar && (
                  <p className="mt-1 text-sm text-destructive">{profileForm.formState.errors.avatar.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Current Password</label>
                <input
                  {...passwordForm.register('currentPassword')}
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">New Password</label>
                <input
                  {...passwordForm.register('newPassword')}
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Confirm New Password</label>
                <input
                  {...passwordForm.register('confirmPassword')}
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}