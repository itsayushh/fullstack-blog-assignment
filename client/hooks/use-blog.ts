'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/blog';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

export function useBlogs(page = 1, search = '') {
  return useQuery({
    queryKey: ['blogs', page, search],
    queryFn: () => blogService.getBlogs({page, search}),
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlog(id),
    enabled: !!id,
  });
}

export function useMyBlogs(id?: string) {
  return useQuery({
    queryKey: ['myBlogs', id],
    queryFn: () => blogService.getMyBlogs(),
    enabled: !!id,
  });
}

export function useBlogMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully!');
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Failed to create blog');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast.success('Blog updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update blog');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete blog');
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: (blogId: string) => blogService.toggleLike(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
    onError: () => {
      toast.error('Failed to like/unlike blog');
    },
  });

  return {
    createBlog: createMutation.mutate,
    updateBlog: updateMutation.mutate,
    deleteBlog: deleteMutation.mutate,
    toggleLike: toggleLikeMutation.mutate,
    isLiking: toggleLikeMutation.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

  };
}