import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ClientNavbar from '../components/Navbar_cliente';
import { procesarPago } from '../api';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cita, servicio, profesional, tipo, fechaTexto, hora } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    // Verificar que tenemos los datos necesarios
    if (!cita || !servicio) {
      alert('No se encontraron datos de la cita');
      navigate('/cliente/profesionales');
    }
  }, [cita, servicio, navigate]);

  if (!cita || !servicio) {
    return null;
  }

  const appointmentData = {
    service: `${servicio.name} con ${profesional?.nombre || ''} ${profesional?.apellido || ''}`,
    date: fechaTexto,
    time: hora,
    duracion: `${servicio.duration} minutos`,
    tipo: tipo === 'videollamada' ? 'Videollamada' : 'Presencial',
    subtotal: cita.precio,
    tax: Math.round(cita.precio * 0.19), // IVA del 19%
    total: Math.round(cita.precio * 1.19)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatear número de tarjeta
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    // Formatear fecha de expiración
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    // Limitar CVV a 3 dígitos
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData({
      ...cardData,
      [name]: formattedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (processing) return;
    
    // Validaciones básicas
    if (paymentMethod === 'card') {
      if (!cardData.cardName || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
        alert('Por favor completa todos los campos');
        return;
      }
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'paypal') {
        // Redirigir a PayPal
        const response = await fetch('http://localhost:8000/api/pagos/paypal/crear-pago', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ cita_id: cita.id })
        });

        if (!response.ok) {
          throw new Error('Error al crear el pago con PayPal');
        }

        const data = await response.json();
        
        // Redirigir a PayPal
        window.location.href = data.approval_url;
      } else {
        // Pago con tarjeta (simulado)
        const pagoData = {
          cita_id: cita.id,
          monto: appointmentData.total,
          metodo_pago: 'tarjeta'
        };

        await procesarPago(pagoData);
        alert('¡Pago procesado exitosamente!');
        navigate('/cliente/citas');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Pago seguro
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Formulario de pago */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Mensaje de seguridad */}
              <div className="flex items-center text-gray-600 mb-6 pb-6 border-b">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Transacción segura y encriptada</span>
              </div>

              {/* Métodos de pago */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Elige tu método de pago
              </h2>

              <div className="space-y-3 mb-6">
                {/* Tarjeta de crédito/débito */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'card'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'card' && (
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      Tarjeta de crédito/débito
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-8" />
                  </div>
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      paymentMethod === 'paypal' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'paypal' && (
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">PayPal</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                </button>
              </div>

              {/* Formulario de tarjeta */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre del titular */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del titular
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  {/* Número de tarjeta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="**** **** **** ****"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  {/* Fecha y CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MM/AA
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleInputChange}
                        placeholder="CVV"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Botón de pago */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Procesando...' : 'Pagar ahora'}
                  </button>

                  {/* Términos */}
                  <p className="text-xs text-gray-600 text-center mt-4">
                    Al hacer clic en "Pagar ahora", aceptas los{' '}
                    <Link to="/terminos" className="text-cyan-500 hover:text-cyan-600">
                      Términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link to="/privacidad" className="text-cyan-500 hover:text-cyan-600">
                      Política de privacidad
                    </Link>
                    .
                  </p>
                </form>
              )}

              {/* PayPal */}
              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Redirigiendo...' : 'Continuar con PayPal'}
                  </button>
                  <p className="text-xs text-gray-600 mt-4">
                    Serás redirigido a PayPal para completar tu pago de forma segura
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Nota:</strong> El monto será convertido automáticamente a USD
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Aproximadamente ${Math.round(appointmentData.total / 4000)} USD
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumen de tu cita
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Servicio:</p>
                  <p className="font-semibold text-gray-900">
                    {appointmentData.service}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Tipo:</p>
                  <p className="font-semibold text-gray-900">
                    {appointmentData.tipo}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">Fecha:</p>
                    <p className="font-semibold text-gray-900">
                      {appointmentData.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Hora:</p>
                    <p className="font-semibold text-gray-900">
                      {appointmentData.time}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Duración:</p>
                  <p className="font-semibold text-gray-900">
                    {appointmentData.duracion}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      ${appointmentData.subtotal.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (19%):</span>
                    <span className="font-medium text-gray-900">
                      ${appointmentData.tax.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total a pagar:
                    </span>
                    <span className="text-2xl font-bold text-green-500">
                      ${appointmentData.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">COP</p>
                </div>
              </div>

              {/* Iconos de seguridad */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center space-x-4 text-gray-400">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Pago 100% seguro y protegido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;