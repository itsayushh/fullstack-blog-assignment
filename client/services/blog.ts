import { apiClient } from '@/lib/api';
import { Blog, BlogsResponse, BlogResponse } from '@/types';

export const blogService = {
  getBlogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    author?: string;
    tags?: string;
    sort?: string;
  }): Promise<BlogsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.author) queryParams.append('author', params.author);
    if (params?.tags) queryParams.append('tags', params.tags);
    if (params?.sort) queryParams.append('sort', params.sort);

    const response = await apiClient.get(`/blogs?${queryParams.toString()}`);
    return response.data;
  },

  getBlog: async (id: string): Promise<BlogResponse> => {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (blogData: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string;
    category?: string;
    status?: string;
  }): Promise<{ message: string; blog: Blog }> => {
    const response = await apiClient.post('/blogs', blogData);
    return response.data;
  },

  updateBlog: async (id: string, blogData: {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string;
    category?: string;
    status?: string;
  }): Promise<{ message: string; blog: Blog }> => {
    const response = await apiClient.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  },

  toggleLike: async (id: string): Promise<{
    message: string;
    likeCount: number;
    isLiked: boolean;
  }> => {
    const response = await apiClient.post(`/blogs/${id}/like`);
    return response.data;
  },

  getUserBlogs: async (userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<BlogsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get(`/blogs/user/${userId}?${queryParams.toString()}`);
    return response.data;
  },

  getMyBlogs: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<BlogsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get(`/blogs/my/posts?${queryParams.toString()}`);
    return response.data;
  },
};