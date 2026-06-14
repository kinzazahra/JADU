import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Voice from '@/pages/Voice';
import Gesture from '@/pages/Gesture';
import Browser from '@/pages/Browser';
import Desktop from '@/pages/Desktop';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="jadu-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            {/* MainLayout handles the Sidebar, Navbar, and global WebSocket Connection */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/voice" element={<Voice />} />
              <Route path="/gesture" element={<Gesture />} />
              <Route path="/browser" element={<Browser />} />
              <Route path="/desktop" element={<Desktop />} />
              
              {/* Placeholders for upcoming modules */}
              <Route path="/tasks" element={<div className="glass p-6 rounded-xl">Task Queue Placeholder</div>} />
              <Route path="/analytics" element={<div className="glass p-6 rounded-xl">Analytics Placeholder</div>} />
              <Route path="/settings" element={<div className="glass p-6 rounded-xl">Settings Placeholder</div>} />
            </Route>
          </Route>

          {/* Fallback route redirects to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;