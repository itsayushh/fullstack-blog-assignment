'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBlogMutations } from '@/hooks/use-blog';
import { Blog } from '@/types';

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

  const {
    register,
    handleSubmit,
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
        <label htmlFor="content" className="block text-sm font-medium text-foreground">
          Content *
        </label>
        <textarea
          {...register('content')}
          rows={12}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground"
          placeholder="Write your blog content here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-destructive">{errors.content.message}</p>
        )}
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