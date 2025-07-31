'use client';

import { useState } from 'react';
import { useBlogs } from '@/hooks/use-blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogSearch from '@/components/blog/BlogSearch';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    search: '',
    category: '',
    sort: 'newest',
    tags: '',
  });

  // const { data, isLoading, error } = useBlogs({
  //   ...searchParams,
  //   limit: 12,
  // });
  const { data, isLoading, error } = useBlogs(searchParams.page, searchParams.search);

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilter = (filters: any) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">Failed to load blogs. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Welcome to BlogSpace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing stories, insights, and ideas from our community of writers
        </p>
      </div>

      {/* Search and Filters */}
      <BlogSearch onSearch={handleSearch} onFilter={handleFilter} />

      {/* Stats */}
      {data && (
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {data.blogs.length} of {data.pagination.totalBlogs} blogs
          {searchParams.search && (
            <span> for "{searchParams.search}"</span>
          )}
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data?.blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(searchParams.page - 1)}
            disabled={!data.pagination.hasPrev}
            className="px-4 py-2 border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === searchParams.page;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(searchParams.page + 1)}
            disabled={!data.pagination.hasNext}
            className="px-4 py-2 border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {data?.blogs.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No blogs found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
}
