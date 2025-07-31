'use client';

import { useAuth } from '@/hooks/use-auth';
import BlogForm from '@/components/forms/BlogForm';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Blog</h1>
        <p className="text-muted-foreground mt-2">Share your thoughts with the world</p>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <BlogForm />
      </div>
    </div>
  );
}