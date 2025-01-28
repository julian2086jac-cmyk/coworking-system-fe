import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { format, addHours, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Building2, X, Check, AlertTriangle, Edit, MoreVertical } from 'lucide-react';
import { api } from '../lib/api';

interface Space {
  id: string;
  name: string;
  price_per_hour: number;
}

interface Booking {
  id: string;
  space: Space;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
}

interface EditForm {
  date: string;
  start_time: string;
  duration: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    date: '',
    start_time: '',
    duration: '1'
  });

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  async function fetchBookings() {
    try {
      const data = await api.bookings.getAll();
      setBookings(data || []);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setError('No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await api.bookings.update(bookingId, { status: newStatus });
      await fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      setError('No se pudo actualizar el estado de la reserva');
    }
  };

  const getAvailableActions = (booking: Booking) => {
    const actions = [];
    
    switch (booking.status) {
      case 'pending':
        actions.push(
          { status: 'confirmed', label: 'Confirmar reserva', className: 'text-green-600 hover:text-green-700' },
          { status: 'cancelled', label: 'Cancelar reserva', className: 'text-red-600 hover:text-red-700' }
        );
        break;
      case 'confirmed':
        actions.push(
          { status: 'completed', label: 'Marcar como completada', className: 'text-blue-600 hover:text-blue-700' },
          { status: 'cancelled', label: 'Cancelar reserva', className: 'text-red-600 hover:text-red-700' }
        );
        break;
      // No se muestran acciones para estados 'cancelled' y 'completed'
      default:
        break;
    }
    
    return actions;
  };

  const handleEditBooking = (booking: Booking) => {
    const startDate = new Date(booking.start_time);
    const endDate = new Date(booking.end_time);
    const durationHours = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));

    setEditingBooking(booking);
    setEditForm({
      date: format(startDate, 'yyyy-MM-dd'),
      start_time: format(startDate, 'HH:mm'),
      duration: durationHours.toString()
    });
    setError(null);
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking) return;

    try {
      const startDateTime = new Date(`${editForm.date}T${editForm.start_time}`);
      const endDateTime = addHours(startDateTime, parseInt(editForm.duration));
      
      if (startDateTime <= new Date()) {
        setError('No puedes hacer reservas en el pasado');
        return;
      }

      // Verificar disponibilidad
      const isAvailable = await api.spaces.checkAvailability(
        editingBooking.space.id,
        startDateTime.toISOString(),
        endDateTime.toISOString()
      );

      if (!isAvailable) {
        setError('Este espacio ya está reservado para el horario seleccionado');
        return;
      }

      const totalPrice = editingBooking.space.price_per_hour * parseInt(editForm.duration);

      await api.bookings.update(editingBooking.id, {
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        total_price: totalPrice,
        status: 'pending'
      });

      await fetchBookings();
      setEditingBooking(null);
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      setError(error instanceof Error ? error.message : 'No se pudo actualizar la reserva');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tus Reservas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona tus reservas de espacios de trabajo
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      Espacio
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fecha
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Hora
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Precio
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Estado
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="relative">
                      <td className="whitespace-nowrap py-6 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                          {booking.space.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-6 text-sm text-gray-500">
                        {format(new Date(booking.start_time), 'PPP', { locale: es })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-6 text-sm text-gray-500">
                        {format(new Date(booking.start_time), 'p', { locale: es })} - 
                        {format(new Date(booking.end_time), 'p', { locale: es })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-6 text-sm text-gray-500">
                        ${booking.total_price}
                      </td>
                      <td className="whitespace-nowrap px-3 py-6 text-sm">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status === 'confirmed' && 'Confirmada'}
                          {booking.status === 'pending' && 'Pendiente'}
                          {booking.status === 'cancelled' && 'Cancelada'}
                          {booking.status === 'completed' && 'Completada'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-6 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <div className="flex justify-end items-center gap-2">
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                              onClick={() => handleEditBooking(booking)}
                              className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-gray-100"
                              title="Editar reserva"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <div className="relative">
                              <button
                                onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                title="Más opciones"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {selectedBooking === booking.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setSelectedBooking(null)}
                                  />
                                  <div 
                                    className="absolute right-0 z-50 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    style={{ 
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      right: '100%',
                                      marginRight: '0.5rem'
                                    }}
                                  >
                                    <div className="py-1">
                                      {getAvailableActions(booking).map((action, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleStatusChange(booking.id, action.status)}
                                          className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${action.className}`}
                                        >
                                          {action.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Editar Reserva - {editingBooking.space.name}
                </h3>
                <button
                  onClick={() => setEditingBooking(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora de inicio</label>
                  <input
                    type="time"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duración</label>
                  <select
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {[1, 2, 3, 4, 8].map((hours) => (
                      <option key={hours} value={hours}>
                        {hours} {hours === 1 ? 'hora' : 'horas'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setEditingBooking(null)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateBooking}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}