import { apiClient } from '@/lib/api';
import { User, AuthResponse } from '@/types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string, role?: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', { username, email, password, role });
    return response.data;
  },

  me: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (username?: string, bio?: string, avatar?: string): Promise<{ user: User; message: string }> => {
    const response = await apiClient.put('/auth/profile', { username, bio, avatar });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};