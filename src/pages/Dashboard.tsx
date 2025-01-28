import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, Calendar, TrendingUp } from 'lucide-react';

interface SpaceStats {
  name: string;
  bookings: number;
}

interface HourlyStats {
  hour: number;
  bookings: number;
}

interface StatusStats {
  status: string;
  count: number;
}

interface DashboardMetrics {
  totalBookings: number;
  activeSpaces: number;
  averageBookingDuration: number;
  occupancyRate: number;
}

const COLORS = ['#16a34a', '#eab308', '#dc2626', '#2563eb'];
const STATUS_NAMES = {
  confirmed: 'Confirmadas',
  pending: 'Pendientes',
  cancelled: 'Canceladas',
  completed: 'Completadas'
};

export default function Dashboard() {
  const [spaceStats, setSpaceStats] = useState<SpaceStats[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBookings: 0,
    activeSpaces: 0,
    averageBookingDuration: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchSpaceStats(),
      fetchHourlyStats(),
      fetchStatusStats(),
      fetchDashboardMetrics()
    ])
      .catch(err => {
        console.error('Error loading dashboard data:', err);
        setError('No se pudieron cargar las estadísticas. Por favor, intenta de nuevo más tarde.');
      })
      .finally(() => setLoading(false));
  }, []);

  async function fetchSpaceStats() {
    try {
      const data = await api.dashboard.getSpaceStats();
      setSpaceStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas de espacios:', error);
      throw error;
    }
  }

  async function fetchHourlyStats() {
    try {
      const data = await api.dashboard.getHourlyStats();
      setHourlyStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas por hora:', error);
      throw error;
    }
  }

  async function fetchStatusStats() {
    try {
      const data = await api.dashboard.getStatusStats();
      setStatusStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas por estado:', error);
      throw error;
    }
  }

  async function fetchDashboardMetrics() {
    try {
      const data = await api.dashboard.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error al cargar métricas del dashboard:', error);
      throw error;
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Cargando panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Panel de Control</h1>
          <p className="mt-2 text-sm text-gray-700">
            Análisis y estadísticas de tu espacio de coworking
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Reservas</dt>
                  <dd className="text-lg font-semibold text-gray-900">{metrics.totalBookings}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Espacios Activos</dt>
                  <dd className="text-lg font-semibold text-gray-900">{metrics.activeSpaces}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Duración Promedio</dt>
                  <dd className="text-lg font-semibold text-gray-900">{metrics.averageBookingDuration}h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tasa de Ocupación</dt>
                  <dd className="text-lg font-semibold text-gray-900">{metrics.occupancyRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Popular Spaces Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Espacios Más Populares</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spaceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#16a34a" name="Reservas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribución por Estado</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => 
                    `${STATUS_NAMES[name as keyof typeof STATUS_NAMES]} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribución por Hora</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(hour) => `${hour}:00`}
                />
                <Bar dataKey="bookings" fill="#16a34a" name="Reservas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}