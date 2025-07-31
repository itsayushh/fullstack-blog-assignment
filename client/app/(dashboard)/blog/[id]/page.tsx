'use client';

import { useBlog, useBlogMutations } from '@/hooks/use-blog';
import { useAuth } from '@/hooks/use-auth';
import { Heart, Eye, Calendar, User, Edit, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: blogData, isLoading, error } = useBlog(id);
  const { user } = useAuth();
  const { toggleLike, isLiking } = useBlogMutations();
  const [isLiked, setIsLiked] = useState(false);

  const blog = blogData?.blog;

  // Check if current user has liked the blog
  useState(() => {
    if (blog && user) {
      setIsLiked(blog.likes.includes(user.id));
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Blog not found</h2>
          <p className="text-muted-foreground">The blog you're looking for doesn't exist.</p>
          <Link href="/" className="text-primary hover:text-primary/80 mt-4 inline-block">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user && user.id === blog.author._id;

  const handleLike = () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }
    toggleLike(blog._id);
    setIsLiked(!isLiked);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              blog.status === 'published' 
                ? 'bg-accent/20 text-accent-foreground'
                : blog.status === 'draft'
                ? 'bg-secondary/20 text-secondary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {blog.status}
            </span>
            <span className="px-3 py-1 bg-secondary/20 text-secondary-foreground text-sm rounded-full">
              {blog.category}
            </span>
          </div>
          {canEdit && (
            <Link
              href={`/edit-blog/${blog._id}`}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          )}
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">{blog.title}</h1>
        
        <div className="flex items-center flex-wrap gap-6 text-muted-foreground mb-6">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{blog.author.username}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime} min read</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{blog.views} views</span>
          </div>
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-6">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Like Button */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleLike}
            disabled={isLiking || !user}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              isLiked
                ? 'bg-destructive/10 border-destructive/20 text-destructive'
                : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
            } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{blog.likeCount || blog.likes.length} likes</span>
          </button>
        </div>
      </header>

      {/* Content */}
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
        <section className="bg-muted p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">About the author</h3>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium">
                {blog.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-foreground">{blog.author.username}</h4>
              <p className="text-muted-foreground mt-1">{blog.author.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
        >
          <span>← Back to all blogs</span>
        </Link>
      </div>
    </article>
  );
}