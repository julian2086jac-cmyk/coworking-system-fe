import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import {api} from '../lib/api';
import { Building2, Calendar, LayoutDashboard, LogOut, DoorOpen } from 'lucide-react';

export default function Layout() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // Usando Supabase
      //await supabase.auth.signOut();

      // Usando API REST (comentado)
      await api.auth.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 py-2 text-gray-900">
                <Building2 className="h-6 w-6 mr-2" />
                <span className="font-semibold">CoworkSpace</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/spaces"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === '/spaces'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-900 hover:text-primary-600'
                  }`}
                >
                  <DoorOpen className="h-4 w-4 mr-1" />
                  Espacios
                </Link>
                {user && (
                  <>
                    <Link
                      to="/bookings"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        location.pathname === '/bookings'
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-900 hover:text-primary-600'
                      }`}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Reservas
                    </Link>
                    <Link
                      to="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        location.pathname === '/dashboard'
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-900 hover:text-primary-600'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Panel
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}