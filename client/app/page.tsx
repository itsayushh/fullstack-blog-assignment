'use client';

import { useState, useCallback, useMemo } from 'react';
import { useBlogs } from '@/hooks/use-blog';
import BlogCard from '@/components/blog/BlogCard';
import { Search, Sparkles, TrendingUp, Users, BookOpen, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

console.log('HomePage component rendered'); // Debug log to see when component re-renders

export default function HomePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(''); // Separate input state
  const [searchParams, setSearchParams] = useState({
    page: 1,
    search: '',
    category: '',
    sort: 'newest',
    tags: '',
  });
  
  console.log('Component state updated:', { searchInput, searchParams }); // Debug log
  
  // Memoize the hook parameters to prevent unnecessary re-renders
  const blogParams = useMemo(() => ({
    page: searchParams.page,
    search: searchParams.search,
    category: searchParams.category,
    sort: searchParams.sort,
    tags: searchParams.tags,
  }), [searchParams.page, searchParams.search, searchParams.category, searchParams.sort, searchParams.tags]);

  const { data, isLoading, error } = useBlogs(blogParams);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, search: searchInput, page: 1 }));
  }, [searchInput]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setSearchParams({
      page: 1,
      search: '',
      category: '',
      sort: 'newest',
      tags: '',
    });
  }, []);

  // Memoize the search form to prevent unnecessary re-renders
  const searchForm = useMemo(() => (
    <div className="mb-6">
      <div className="bg-card p-4 rounded-lg shadow border border-border mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              name="blog-search"
              placeholder="Search blogs..."
              value={searchInput}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Search
          </button>
          <button
            type="button"
            onClick={toggleFilters}
            className="flex items-center space-x-2 border border-border px-4 py-2 rounded-lg hover:bg-muted"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </form>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Sort By</label>
              <select
                value={searchParams.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Popular</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select
                value={searchParams.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              >
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="business">Business</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  ), [searchInput, showFilters, searchParams.sort, searchParams.category, handleSearch, handleInputChange, toggleFilters, handleFilterChange]);

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
        {/* Search and Filters */}
        {searchForm}

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
            {data.blogs.map((blog) => (
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
              onClick={clearFilters}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
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