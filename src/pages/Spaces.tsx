import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/store';
import { Users, Clock, DollarSign, MapPin, Wifi, Coffee, X } from 'lucide-react';
import { addHours } from 'date-fns';

interface Space {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price_per_hour: number;
  is_active: boolean;
  location: string;
  address: string;
  city: string;
  amenities: string[];
  image_url?: string;
}

interface BookingForm {
  date: string;
  start_time: string;
  duration: string;
}

export default function Spaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    date: '',
    start_time: '',
    duration: '1'
  });

  useEffect(() => {
    fetchSpaces();
  }, []);

  async function fetchSpaces() {
    try {
      const data = await api.spaces.getAll();
      setSpaces(data || []);
    } catch (error) {
      console.error('Error al cargar espacios:', error);
      setError('No se pudieron cargar los espacios');
    } finally {
      setLoading(false);
    }
  }

  const handleBookingClick = (spaceId: string) => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/spaces' } });
      return;
    }
    setShowBookingForm(spaceId);
    setBookingForm({
      date: '',
      start_time: '',
      duration: '1'
    });
    setError(null);
  };

  const handleSubmitBooking = async (spaceId: string) => {
    if (!user) return;

    try {
      const space = spaces.find(s => s.id === spaceId);
      if (!space) {
        setError('Espacio no encontrado');
        return;
      }

      const startDateTime = new Date(`${bookingForm.date}T${bookingForm.start_time}`);
      const endDateTime = addHours(startDateTime, parseInt(bookingForm.duration));
      
      if (startDateTime <= new Date()) {
        setError('No puedes hacer reservas en el pasado');
        return;
      }

      const totalPrice = space.price_per_hour * parseInt(bookingForm.duration);

      // Verificar disponibilidad
      const isAvailable = await api.spaces.checkAvailability(
        spaceId,
        startDateTime.toISOString(),
        endDateTime.toISOString()
      );

      if (!isAvailable) {
        setError('Este espacio ya está reservado para el horario seleccionado');
        return;
      }

      await api.bookings.create({
        space_id: spaceId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        total_price: totalPrice,
        status: 'pending'
      });

      setShowBookingForm(null);
      navigate('/bookings');
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      setError(error instanceof Error ? error.message : 'No se pudo crear la reserva');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Cargando espacios...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white min-h-screen">
      <div className="relative py-16 bg-primary-900">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Espacios Diseñados para Ti
          </h1>
          <p className="mt-4 text-xl text-primary-100">
            Encuentra el espacio perfecto para tu próxima reunión o día de trabajo
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={space.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'}
                  alt={space.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-900">{space.name}</h3>
                <p className="mt-2 text-secondary-600 line-clamp-2">{space.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-secondary-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Capacidad: {space.capacity} personas</span>
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Disponibilidad inmediata</span>
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>${space.price_per_hour}/hora</span>
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{space.location} - {space.city}</span>
                  </div>
                </div>

                {space.amenities && space.amenities.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-secondary-900 mb-2">Servicios incluidos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {space.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => handleBookingClick(space.id)}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {user ? 'Reservar Ahora' : 'Iniciar Sesión para Reservar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Reserva */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reservar {spaces.find(s => s.id === showBookingForm)?.name}
                </h3>
                <button
                  onClick={() => setShowBookingForm(null)}
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
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora de inicio</label>
                  <input
                    type="time"
                    value={bookingForm.start_time}
                    onChange={(e) => setBookingForm({ ...bookingForm, start_time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duración</label>
                  <select
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
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
                    onClick={() => setShowBookingForm(null)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSubmitBooking(showBookingForm)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Confirmar Reserva
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