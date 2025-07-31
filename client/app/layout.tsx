import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import Navigation from '@/components/layout/Navigation';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlogSpace - Modern Blogging Platform',
  description: 'A modern, fullstack blogging platform built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main>{children}</main>
            <Toaster position="top-right" />
          </div>
        </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}