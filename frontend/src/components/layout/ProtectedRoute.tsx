import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Navbar } from './Navbar';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <DisclaimerBanner compact className="mb-6" />
        <Outlet />
      </main>
    </div>
  );
};
