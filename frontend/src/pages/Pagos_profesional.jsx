import React, { useState, useMemo } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';

const PaymentDetailModal = ({ open, payment, onClose }) => {
  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold">Detalles del Pago</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">ID de Transacción</div>
              <div className="font-medium">{payment.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Estado</div>
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {payment.status === 'completed' ? 'Completado' : payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-gray-500 mb-1">Paciente</div>
            <div className="font-medium text-lg">{payment.patient}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Fecha</div>
              <div className="font-medium">{new Date(payment.date).toLocaleDateString('es-ES')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Hora</div>
              <div className="font-medium">{new Date(payment.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-gray-500 mb-1">Concepto</div>
            <div className="font-medium">{payment.concept}</div>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-gray-500 mb-1">Método de pago</div>
            <div className="font-medium">{payment.method}</div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Monto total</div>
              <div className="text-2xl font-bold text-cyan-600">${payment.amount.toFixed(2)}</div>
            </div>
          </div>

          {payment.notes && (
            <div className="border-t pt-4">
              <div className="text-sm text-gray-500 mb-1">Notas</div>
              <div className="text-sm bg-gray-50 p-3 rounded">{payment.notes}</div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cerrar</button>
          <button onClick={() => alert('Función de factura por implementar')} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
            Descargar Factura
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const ProfessionalPayments = () => {
  // Mock data (reemplazar con API)
  const [payments, setPayments] = useState([
    {
      id: 'PAY-001',
      patient: 'Ana García López',
      date: '2025-11-10T10:00:00',
      amount: 75.00,
      status: 'completed',
      method: 'Tarjeta de crédito',
      concept: 'Consulta psicológica',
      notes: 'Pago por sesión de 60 minutos'
    },
    {
      id: 'PAY-002',
      patient: 'Carlos Méndez Ruiz',
      date: '2025-11-09T15:30:00',
      amount: 85.00,
      status: 'completed',
      method: 'Transferencia bancaria',
      concept: 'Terapia de pareja',
      notes: ''
    },
    {
      id: 'PAY-003',
      patient: 'María Torres Sánchez',
      date: '2025-11-08T09:00:00',
      amount: 60.00,
      status: 'pending',
      method: 'Efectivo',
      concept: 'Consulta de seguimiento',
      notes: 'Pendiente de confirmar'
    },
    {
      id: 'PAY-004',
      patient: 'Juan Pérez Fernández',
      date: '2025-11-07T14:00:00',
      amount: 90.00,
      status: 'completed',
      method: 'PayPal',
      concept: 'Evaluación psicológica',
      notes: ''
    },
    {
      id: 'PAY-005',
      patient: 'Laura Martínez Gómez',
      date: '2025-11-05T11:00:00',
      amount: 70.00,
      status: 'failed',
      method: 'Tarjeta de crédito',
      concept: 'Consulta psicológica',
      notes: 'Pago rechazado por el banco'
    },
    {
      id: 'PAY-006',
      patient: 'Pedro Sánchez Vila',
      date: '2025-11-03T16:00:00',
      amount: 80.00,
      status: 'completed',
      method: 'Transferencia bancaria',
      concept: 'Terapia familiar',
      notes: ''
    },
    {
      id: 'PAY-007',
      patient: 'Sofia Ramírez Castro',
      date: '2025-11-01T10:30:00',
      amount: 75.00,
      status: 'completed',
      method: 'Tarjeta de débito',
      concept: 'Consulta psicológica',
      notes: ''
    },
    {
      id: 'PAY-008',
      patient: 'Diego Fernández Ruiz',
      date: '2025-10-28T13:00:00',
      amount: 95.00,
      status: 'completed',
      method: 'PayPal',
      concept: 'Terapia cognitiva',
      notes: 'Sesión doble (120 min)'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, completed, pending, failed
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState('month'); // week, month, year, all

  // Cálculos de resumen
  const summary = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0);
    const pending = payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0);
    const failed = payments.filter(p => p.status === 'failed').length;
    const completed = payments.filter(p => p.status === 'completed').length;

    return { total, pending, failed, completed };
  }, [payments]);

  // Filtrado
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.concept.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      // Filtro de fecha (simple mock)
      let matchesDate = true;
      if (dateRange !== 'all') {
        const paymentDate = new Date(p.date);
        const now = new Date();
        const daysDiff = Math.floor((now - paymentDate) / (1000 * 60 * 60 * 24));
        
        if (dateRange === 'week' && daysDiff > 7) matchesDate = false;
        if (dateRange === 'month' && daysDiff > 30) matchesDate = false;
        if (dateRange === 'year' && daysDiff > 365) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [payments, searchQuery, statusFilter, dateRange]);

  const openDetail = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-sm text-gray-600 mt-1">Consulta tus ingresos, transacciones y genera reportes.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Ingresos Totales</div>
                <div className="text-2xl font-bold text-gray-900">${summary.total.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-green-600 mt-2">+12% vs mes anterior</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Pendientes</div>
                <div className="text-2xl font-bold text-yellow-600">${summary.pending.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">{payments.filter(p => p.status === 'pending').length} transacciones</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Completados</div>
                <div className="text-2xl font-bold text-cyan-600">{summary.completed}</div>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">{((summary.completed / payments.length) * 100).toFixed(0)}% del total</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Fallidos</div>
                <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Requieren atención</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <input
                type="search"
                placeholder="Buscar por paciente, ID o concepto..."
                className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-cyan-300 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="px-3 py-2 border rounded bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="completed">Completados</option>
                <option value="pending">Pendientes</option>
                <option value="failed">Fallidos</option>
              </select>

              <select
                className="px-3 py-2 border rounded bg-white"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
                <option value="all">Todo el tiempo</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={() => alert('Exportar a CSV (por implementar)')} className="px-4 py-2 bg-white border rounded hover:bg-gray-50 text-sm">
                Exportar CSV
              </button>
              <button onClick={() => alert('Exportar a PDF (por implementar)')} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm">
                Exportar PDF
              </button>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredPayments.length} de {payments.length} transacciones
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron transacciones
                    </td>
                  </tr>
                )}

                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.patient}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.concept}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.method}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'completed' ? 'Completado' : payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => openDetail(payment)}
                        className="text-cyan-600 hover:text-cyan-800 font-medium"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaymentDetailModal
        open={isModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
      />
    </div>
  );
};

export default ProfessionalPayments;