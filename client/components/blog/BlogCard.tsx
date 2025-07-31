import Link from 'next/link';
import { Blog } from '@/types';
import { Heart, Eye, Clock, User } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  showAuthor?: boolean;
}

export default function BlogCard({ blog, showAuthor = true }: BlogCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        {/* Header with status and date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            blog.status === 'published' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : blog.status === 'draft'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {blog.status}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {/* Title */}
        <Link href={`/blog/${blog._id}`}>
          <h3 className="text-lg font-semibold text-card-foreground mb-3 hover:text-primary cursor-pointer line-clamp-2 leading-tight">
            {blog.title}
          </h3>
        </Link>

        {/* Author */}
        {showAuthor && (
          <div className="flex items-center mb-3">
            <User className="w-3.5 h-3.5 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">{blog.author.username}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{blog.readTime} min read</span>
          </div>
        )}
        
        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 text-sm line-clamp-2 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Footer with category, tags, and stats */}
        <div className="space-y-3">
          {/* Category and limited tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium">
              {blog.category}
            </span>
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{blog.tags.length - 2}
              </span>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5" />
                <span>{blog.likeCount || blog.likes.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{blog.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}