import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { BrainCircuit } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BrainCircuit className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}