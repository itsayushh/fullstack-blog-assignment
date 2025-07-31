import Link from 'next/link';
import { Blog } from '@/types';
import { Heart, MessageCircle, Eye, Clock, User } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  showAuthor?: boolean;
}

export default function BlogCard({ blog, showAuthor = true }: BlogCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            blog.status === 'published' 
              ? 'bg-accent/20 text-accent-foreground'
              : blog.status === 'draft'
              ? 'bg-secondary/20 text-secondary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            {blog.status}
          </span>
          <span className="text-sm text-muted-foreground">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <Link href={`/blog/${blog._id}`}>
          <h3 className="text-xl font-semibold text-card-foreground mb-2 hover:text-primary cursor-pointer line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {showAuthor && (
          <div className="flex items-center mb-3">
            <User className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">{blog.author.username}</span>
          </div>
        )}
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{blog.likeCount || blog.likes.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}