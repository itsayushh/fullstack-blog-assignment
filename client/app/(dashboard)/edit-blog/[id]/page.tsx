'use client';

import { useBlog } from '@/hooks/use-blog';
import { useAuth } from '@/hooks/use-auth';
import BlogForm from '@/components/forms/BlogForm';
import { useParams, useRouter } from 'next/navigation';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, isLoading: authLoading } = useAuth();
  const { data: blogData, isLoading } = useBlog(id);

  const blog = blogData?.blog;

  if (authLoading || isLoading) {
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

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Blog not found</h2>
        </div>
      </div>
    );
  }

  // Check if user can edit this blog
  if (blog.author._id !== user.id && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to edit this blog.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Blog</h1>
        <p className="text-muted-foreground mt-2">Update your blog post</p>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <BlogForm blog={blog} />
      </div>
    </div>
  );
}