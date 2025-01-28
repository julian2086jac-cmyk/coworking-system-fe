import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { api } from '../lib/api';

export default function ProtectedRoute() {
  const { user, setUser } = useAuthStore();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await api.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}