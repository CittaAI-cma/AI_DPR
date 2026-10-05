// @ts-nocheck
import React from 'react';
import { Navbar } from './Navbar';
import { useAuthStore } from '@/store/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const railClear = isAuthenticated ? 'max-[1528px]:pl-[4.75rem]' : '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className={`container mx-auto px-4 py-8 max-w-7xl animate-fadeIn flex-1 ${railClear}`}>
        {children}
      </main>
      <footer className={`border-t py-4 text-center text-xs text-muted-foreground ${railClear}`}>
        <a href="/privacy" className="hover:underline">
          Privacy notice
        </a>
        {' · '}
        MSME One Department
      </footer>
    </div>
  );
};
