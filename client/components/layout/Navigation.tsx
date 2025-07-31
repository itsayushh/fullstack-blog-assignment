'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { PenTool, Home, User, LogOut, Settings } from 'lucide-react';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-card shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <PenTool className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">BlogSpace</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                {user?.role === 'author' || user?.role === 'admin' ? (
                  <Link
                    href="/create-blog"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Write
                  </Link>
                ) : null}

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{user?.username}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
