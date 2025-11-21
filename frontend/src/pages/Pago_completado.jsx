import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';

const PagoCompletado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ejecutarPago = async () => {
      const paymentId = searchParams.get('paymentId');
      const payerId = searchParams.get('PayerID');
      const citaId = searchParams.get('cita_id');

      if (!paymentId || !payerId) {
        setError('Faltan parámetros de pago');
        setProcessing(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/pagos/paypal/ejecutar-pago?payment_id=${paymentId}&payer_id=${payerId}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Error al confirmar el pago');
        }

        const data = await response.json();
        
        // Esperar 2 segundos antes de redirigir
        setTimeout(() => {
          navigate('/cliente/citas');
        }, 2000);
      } catch (err) {
        console.error('Error al ejecutar pago:', err);
        setError(err.message);
        setProcessing(false);
      }
    };

    ejecutarPago();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        {processing && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Procesando tu pago...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras confirmamos tu pago con PayPal
            </p>
          </div>
        )}

        {!processing && !error && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Pago Exitoso!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu cita ha sido confirmada y el pago se procesó correctamente
            </p>
            <p className="text-sm text-gray-500">
              Redirigiendo a tus citas...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error al procesar el pago
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/cliente/citas')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Volver a Mis Citas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagoCompletado;
