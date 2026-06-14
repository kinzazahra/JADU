import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize the neural link globally
  useWebSocket();

  return (
    <div className="flex h-screen bg-secondary/20 overflow-hidden text-foreground">
      <div className="hidden md:block w-64 h-full shrink-0">
        <Sidebar />
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full shadow-2xl animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}