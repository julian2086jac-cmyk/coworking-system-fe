import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Spaces from './pages/Spaces';
import Bookings from './pages/Bookings';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './lib/store';
import { api } from './lib/api';

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Verificar la sesión inicial
    const checkSession = async () => {
      try {
        const session = await api.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      }
    };

    checkSession();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;