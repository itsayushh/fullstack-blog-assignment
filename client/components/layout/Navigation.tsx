'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { PenTool, Home, User, LogOut, Settings, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <PenTool className="w-6 h-6 text-primary group-hover:scale-105 transition-transform" />
              <span className="text-lg font-bold text-foreground">
                Blog<span className="text-primary">Space</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                
                {(user?.role === 'author' || user?.role === 'admin') && (
                  <Button asChild size="sm">
                    <Link href="/create-blog">
                      <PenTool className="w-4 h-4 mr-1.5" />
                      Write
                    </Link>
                  </Button>
                )}

                <ThemeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden lg:block">{user?.username}</span>
                      <Badge variant="secondary" className="text-xs capitalize hidden lg:block">
                        {user?.role}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-border">
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                  
                  {(user?.role === 'author' || user?.role === 'admin') && (
                    <Link
                      href="/create-blog"
                      className="flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-md mx-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PenTool className="w-4 h-4" />
                      <span className="text-sm">Write</span>
                    </Link>
                  )}

                  <div className="px-3 py-2 border-t border-border mt-2 pt-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{user?.username}</span>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {user?.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground py-1.5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Profile Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-destructive hover:text-destructive/80 py-1.5 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-1 px-1">
                  <Link
                    href="/auth/login"
                    className="block text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
