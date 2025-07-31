'use client';

import { useState } from 'react';
import { useBlogs } from '@/hooks/use-blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogSearch from '@/components/blog/BlogSearch';
import { Search, Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10">
        <Card className="w-96 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading BlogSpace</h3>
            <p className="text-muted-foreground text-center">Discovering amazing stories for you...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10">
        <Card className="w-96 shadow-xl border-destructive/20">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6">We couldn't load the blogs. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="py-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome to BlogSpace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Blog<span className="text-primary">Space</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
              Discover amazing stories, insights, and ideas from our community of writers
            </p>
            
            {/* Compact Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{data?.pagination?.totalBlogs || '100+'}</div>
                <div className="text-xs text-muted-foreground">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">50+</div>
                <div className="text-xs text-muted-foreground">Writers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">1M+</div>
                <div className="text-xs text-muted-foreground">Reads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <BlogSearch onSearch={handleSearch} onFilter={handleFilter} />
        </div>

        {/* Results Stats */}
        {data && (
          <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Showing {data.blogs.length} of {data.pagination.totalBlogs} blogs</span>
              {searchParams.search && (
                <Badge variant="outline" className="text-xs">
                  "{searchParams.search}"
                </Badge>
              )}
            </div>
            <span>Page {searchParams.page} of {data.pagination.totalPages}</span>
          </div>
        )}

        {/* Blog Grid */}
        {data?.blogs && data.blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.blogs.map((blog, index) => (
              <div 
                key={blog._id} 
                className="group transition-all duration-200 hover:scale-[1.02]"
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No blogs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters.
            </p>
            <Button 
              onClick={() => {
                setSearchParams({
                  page: 1,
                  search: '',
                  category: '',
                  sort: 'newest',
                  tags: '',
                });
              }}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Simple Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Button
              onClick={() => handlePageChange(searchParams.page - 1)}
              disabled={!data.pagination.hasPrev}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(
                  data.pagination.totalPages - 4,
                  Math.max(1, searchParams.page - 2)
                )) + i;
                
                if (pageNum > data.pagination.totalPages) return null;
                
                const isActive = pageNum === searchParams.page;
                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="min-w-[36px] h-9"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              onClick={() => handlePageChange(searchParams.page + 1)}
              disabled={!data.pagination.hasNext}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
