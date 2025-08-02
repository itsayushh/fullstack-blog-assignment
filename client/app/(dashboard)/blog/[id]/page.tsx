'use client';

import { useBlog, useBlogMutations } from '@/hooks/use-blog';
import { useAuth } from '@/hooks/use-auth';
import { Heart, Eye, Calendar, User, Edit, Clock, Tag, ArrowLeft, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: blogData, isLoading, error } = useBlog(id);
  const { user } = useAuth();
  const { toggleLike, isLiking, deleteBlog } = useBlogMutations();
  const [isLiked, setIsLiked] = useState(false);

  const blog = blogData?.blog;

  // Check if current user has liked the blog
  useEffect(() => {
    if (blog && user) {
      setIsLiked(blog.likes.some(like => like._id === user.id));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10">
        <Card className="w-96 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading Article</h3>
            <p className="text-muted-foreground text-center">Preparing your reading experience...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10">
        <Card className="w-96 shadow-xl border-destructive/20">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = user && user.id === blog.author._id || user?.role === 'admin';

  const handleLike = () => {
    if (!user) {
      toast.error('You must be logged in to like a blog');
      return;
    }
    toggleLike(blog._id);
    setIsLiked(!isLiked);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-6">
      {/* Simple Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild size="sm">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        {/* Status and Edit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant={blog.status === 'published' ? 'default' : 'secondary'} className="text-xs">
              {blog.status}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {blog.category}
            </Badge>
          </div>
          {canEdit && (
            <div className="flex items-center space-x-3">
              <Button asChild size="sm">
                <Link href={`/edit-blog/${blog._id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
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
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author and Meta */}
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog.author.username}`} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {blog.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{blog.author.username}</p>
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>{blog.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Like and Share */}
        <div className="flex items-center space-x-3 mb-8">
          <Button
            onClick={handleLike}
            disabled={isLiking || !user || user.role==='reader'}
            variant={isLiked ? "default" : "outline"}
            size="sm"
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {blog.likeCount || blog.likes.length}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success('Blog URL copied to clipboard');
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }

            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <Separator className="mb-8" />
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {blog.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && (
            <p key={index} className="mb-6 text-foreground leading-relaxed text-lg">
              {paragraph}
            </p>
          )
        ))}
      </div>

      {/* Author Bio */}
      {blog.author.bio && (
        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">About the Author</h3>
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog.author.username}`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {blog.author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-foreground mb-1">{blog.author.username}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{blog.author.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Simple Navigation */}
      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Articles
          </Link>
        </Button>
      </div>
    </article>
  );
}