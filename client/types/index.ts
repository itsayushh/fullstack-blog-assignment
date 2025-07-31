export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'author' | 'reader';
  avatar: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    bio?: string;
  };
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  likes: string[]; // Array of user IDs
  views: number;
  readTime: number;
  likeCount: number; // Virtual field
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BlogResponse {
  blog: Blog;
}

export interface ApiError {
  message: string;
}