'use client';

import { useAuth } from '@/hooks/use-auth';
import { useBlogs, useMyBlogs } from '@/hooks/use-blog';
import { useBlogMutations } from '@/hooks/use-blog';
import BlogCard from '@/components/blog/BlogCard';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText, TrendingUp, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/services/blog';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data,isLoading} = useMyBlogs(user?.id);
  const { deleteBlog } = useBlogMutations();
  const router = useRouter();

  if (authLoading || isLoading) {
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

  // const blog = use
  const userBlogs = data?.blogs || [];
  const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likeCount || blog.likes.length), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user.username}!</p>
        </div>
        {(user.role === 'author' || user.role === 'admin') && (
          <Link
            href="/create-blog"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog</span>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-primary" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-card-foreground">Total Blogs</h3>
              <p className="text-3xl font-bold text-primary mt-1">{userBlogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-accent" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-card-foreground">Published</h3>
              <p className="text-3xl font-bold text-accent mt-1">
                {userBlogs.filter(blog => blog.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-secondary" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-card-foreground">Total Views</h3>
              <p className="text-3xl font-bold text-secondary mt-1">{totalViews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
              <span className="text-destructive text-lg">❤</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-card-foreground">Total Likes</h3>
              <p className="text-3xl font-bold text-destructive mt-1">{totalLikes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Blogs */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Blogs</h2>
        {userBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBlogs.map((blog) => (
              <div key={blog._id} className="relative">
                <BlogCard blog={blog} showAuthor={false} />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Link
                    href={`/edit-blog/${blog._id}`}
                    className="p-2 bg-card rounded-full shadow-lg hover:bg-muted transition-colors"
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this blog?')) {
                        deleteBlog(blog._id);
                      }
                    }}
                    className="p-2 bg-card rounded-full shadow-lg hover:bg-muted transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">No blogs yet</h3>
            <p className="text-muted-foreground mb-4">Start writing your first blog post</p>
            {(user.role === 'author' || user.role === 'admin') && (
              <Link
                href="/create-blog"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Your First Blog
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
