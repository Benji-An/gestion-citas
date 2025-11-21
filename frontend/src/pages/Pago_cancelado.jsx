import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';

const PagoCancelado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const citaId = searchParams.get('cita_id');

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pago Cancelado
          </h2>
          
          <p className="text-gray-600 mb-6">
            Has cancelado el proceso de pago. Tu cita ha sido creada pero está pendiente de pago.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Nota:</strong> Puedes completar el pago más tarde desde tu lista de citas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/cliente/citas')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Ver Mis Citas
            </button>
            {citaId && (
              <button
                onClick={() => navigate(`/Pasarela_pago?cita_id=${citaId}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Intentar de Nuevo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoCancelado;
