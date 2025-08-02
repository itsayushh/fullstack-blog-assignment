'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlogMutations } from '@/hooks/use-blog';
import { Blog } from '@/types';
import { useState, useEffect } from 'react';
import { Eye, Edit, FileText } from 'lucide-react';
import Markdown from '@/components/ui/markdown';

const blogSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  excerpt: z.string().max(300, 'Excerpt cannot exceed 300 characters').optional(),
  tags: z.string(),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['draft', 'published', 'archived']),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  blog?: Blog;
  onSuccess?: () => void;
}

export default function BlogForm({ blog, onSuccess }: BlogFormProps) {
  const { createBlog, updateBlog, isCreating, isUpdating } = useBlogMutations();
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [watchedContent, setWatchedContent] = useState('');
  const [watchedTitle, setWatchedTitle] = useState('');
  const [watchedExcerpt, setWatchedExcerpt] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: blog ? {
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      tags: blog.tags.join(', '),
      category: blog.category,
      status: blog.status,
    } : {
      status: 'published',
      category: 'general',
    },
  });

  const onSubmit = (data: BlogFormData) => {
    const blogData = {
      ...data,
      tags: data.tags, // Backend expects comma-separated string
    };

    if (blog) {
      updateBlog({ id: blog._id, data: blogData });
    } else {
      createBlog(blogData);
    }
    
    onSuccess?.();
  };

  const isLoading = isCreating || isUpdating;

  // Use watch to get current values for preview
  const currentContent = watch('content') || '';
  const currentTitle = watch('title') || '';
  const currentExcerpt = watch('excerpt') || '';

  // Update state when form values change to avoid hydration issues
  useEffect(() => {
    setWatchedContent(currentContent);
    setWatchedTitle(currentTitle);
    setWatchedExcerpt(currentExcerpt);
  }, [currentContent, currentTitle, currentExcerpt]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground">
          Title *
        </label>
        <input
          {...register('title')}
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
          placeholder="Enter blog title..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-foreground">
          Excerpt
        </label>
        <textarea
          {...register('excerpt')}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
          placeholder="Brief description of your blog..."
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-destructive">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-foreground">
            Content *
          </label>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => setPreviewMode('edit')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                previewMode === 'edit'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                previewMode === 'preview'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('split')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                previewMode === 'split'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4" />
              Split
            </button>
          </div>
        </div>

        <div className={`grid gap-4 ${previewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {(previewMode === 'edit' || previewMode === 'split') && (
            <div>
              <textarea
                {...register('content')}
                rows={12}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground font-mono text-sm"
                placeholder="Write your blog content here using Markdown...

# Example Heading
This is a paragraph with **bold** and *italic* text.

## Code Example
```javascript
const greeting = 'Hello, World!';
console.log(greeting);
```

- List item 1
- List item 2
- List item 3

> This is a blockquote
"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>
          )}

          {(previewMode === 'preview' || previewMode === 'split') && (
            <div className="border border-border rounded-md p-4 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-2 font-medium">PREVIEW</div>
              {watchedContent ? (
                <div className="min-h-[200px]">
                  <Markdown>{watchedContent}</Markdown>
                </div>
              ) : (
                <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Start typing to see the markdown preview...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          <p>💡 <strong>Markdown Tips:</strong> Use **bold**, *italic*, `code`, # headings, - lists, {'>'}quotes, and ```code blocks```</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground">
            Category *
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
          >
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="business">Business</option>
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-foreground">
          Tags (comma separated)
        </label>
        <input
          {...register('tags')}
          type="text"
          placeholder="react, javascript, web development"
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Separate tags with commas (e.g., react, javascript, tutorial)
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
      >
        {isLoading ? (blog ? 'Updating...' : 'Creating...') : (blog ? 'Update Blog' : 'Create Blog')}
      </button>
    </form>
  );
}