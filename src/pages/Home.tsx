import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { Building2, Users, Calendar, ArrowRight, Coffee, Wifi, Monitor } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Home() {
  const { user } = useAuthStore();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-10" />
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
            <div>
              <div className="flex justify-center mb-8">
                <Logo className="h-20 w-20" />
              </div>
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-primary-900/10 hover:ring-primary-900/20">
                  <span className="text-primary-800">
                    Descubre nuestras nuevas salas de reuniones.{' '}
                    <Link to="/spaces" className="font-semibold text-primary-600">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Ver todos los espacios <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-primary-900 sm:text-6xl">
                  Tu Espacio de Trabajo Perfecto te Espera
                </h1>
                <p className="mt-6 text-lg leading-8 text-secondary-600">
                  Reserva espacios de coworking profesionales, salas de reuniones y oficinas privadas. Únete a nuestra comunidad de profesionales y emprendedores.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    to={user ? "/spaces" : "/login"}
                    className="rounded-md bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200"
                  >
                    Ingresar
                  </Link>
                  <button
                    onClick={scrollToFeatures}
                    className="text-sm font-semibold leading-6 text-primary-900 hover:text-primary-700 transition-colors duration-200 flex items-center gap-1"
                  >
                    Saber más <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div id="features-section" className="mt-32 sm:mt-56 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Todo lo que necesitas</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">Sin complicaciones de oficina</p>
            <p className="mt-6 text-lg leading-8 text-secondary-600">
              Concéntrate en tu trabajo mientras nosotros nos encargamos del espacio. Desde internet de alta velocidad hasta café, lo tenemos todo cubierto.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="bg-secondary-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-7 text-secondary-900">Ubicaciones Premium</h3>
              <p className="mt-2 text-base leading-7 text-secondary-600">
                Ubicaciones estratégicas en el centro de la ciudad con fácil acceso al transporte
              </p>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-7 text-secondary-900">Eventos Comunitarios</h3>
              <p className="mt-2 text-base leading-7 text-secondary-600">
                Eventos regulares de networking y oportunidades de desarrollo profesional
              </p>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-7 text-secondary-900">Reservas Flexibles</h3>
              <p className="mt-2 text-base leading-7 text-secondary-600">
                Reserva espacios por hora, día o mes - lo que mejor se adapte a tus necesidades
              </p>
            </div>
          </div>
        </div>

        {/* Amenities section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Wifi className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900">Internet de Alta Velocidad</h4>
                <p className="mt-2 text-secondary-600">Conexión estable y rápida para tu trabajo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Coffee className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900">Café Ilimitado</h4>
                <p className="mt-2 text-secondary-600">Mantente productivo durante todo el día</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Monitor className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-secondary-900">Equipamiento Moderno</h4>
                <p className="mt-2 text-secondary-600">Todo lo necesario para tu trabajo diario</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}