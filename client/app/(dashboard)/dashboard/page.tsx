'use client';

import { useAuth } from '@/hooks/use-auth';
import { useBlogs, useMyBlogs } from '@/hooks/use-blog';
import { useBlogMutations } from '@/hooks/use-blog';
import BlogCard from '@/components/blog/BlogCard';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText, TrendingUp, Eye, Heart, Calendar, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/services/blog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data,isLoading} = useMyBlogs(user?.id);
  const { deleteBlog } = useBlogMutations();
  const router = useRouter();

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="w-96 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </CardContent>
        </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
                <p className="text-muted-foreground">
                  Good to see you, <span className="font-medium text-foreground">{user.username}</span>
                  <Badge variant="secondary" className="ml-2 capitalize">
                    {user.role}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
          {(user.role === 'author' || user.role === 'admin') && (
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/create-blog">
                <Plus className="w-4 h-4 mr-2" />
                New Blog Post
              </Link>
            </Button>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Blogs</CardTitle>
              <FileText className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{userBlogs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userBlogs.length === 1 ? 'blog post' : 'blog posts'} created
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {userBlogs.filter(blog => blog.status === 'published').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                live blog posts
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <Eye className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                across all posts
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
              <Heart className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalLikes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                from readers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Blogs Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Your Blog Posts
                </CardTitle>
                <CardDescription className="mt-2">
                  Manage and track the performance of your content
                </CardDescription>
              </div>
              {userBlogs.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {userBlogs.length} {userBlogs.length === 1 ? 'post' : 'posts'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {userBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBlogs.map((blog) => (
                  <div key={blog._id} className="relative group">
                    <div className="transition-transform duration-200 group-hover:scale-[1.02]">
                      <BlogCard blog={blog} showAuthor={false} />
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button asChild size="sm" variant="secondary" className="shadow-lg">
                        <Link href={`/edit-blog/${blog._id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="shadow-lg"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this blog?')) {
                            deleteBlog(blog._id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start your blogging journey by creating your first post. Share your thoughts, stories, and expertise with the world.
                </p>
                {(user.role === 'author' || user.role === 'admin') && (
                  <Button asChild size="lg" className="shadow-lg">
                    <Link href="/create-blog">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Blog
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
