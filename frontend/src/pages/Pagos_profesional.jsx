import React, { useState, useMemo } from 'react';
import ProfessionalNavbar from '../components/Navbar_profesional';

const descargarFactura = (payment) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Factura ${payment.id}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #0891b2;
          }
          .header h1 {
            color: #0891b2;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
          }
          .info-block {
            flex: 1;
          }
          .info-block h3 {
            color: #0891b2;
            border-bottom: 2px solid #0891b2;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .info-row {
            margin: 8px 0;
          }
          .label {
            font-weight: bold;
            color: #666;
            display: inline-block;
            width: 120px;
          }
          .details-table {
            width: 100%;
            margin: 30px 0;
            border-collapse: collapse;
          }
          .details-table th {
            background: #0891b2;
            color: white;
            padding: 12px;
            text-align: left;
          }
          .details-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          .total-section {
            margin-top: 30px;
            text-align: right;
          }
          .total-row {
            padding: 10px 0;
            font-size: 18px;
          }
          .total-amount {
            font-size: 32px;
            color: #0891b2;
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
          }
          .status-completado { background: #d1fae5; color: #059669; }
          .status-pendiente { background: #fef3c7; color: #d97706; }
          .status-fallido { background: #fee2e2; color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FACTURA</h1>
          <p>Sistema de Gestión de Citas</p>
          <p>Fecha de emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div class="invoice-info">
          <div class="info-block">
            <h3>Información de la Transacción</h3>
            <div class="info-row">
              <span class="label">Factura N°:</span> ${payment.id}
            </div>
            <div class="info-row">
              <span class="label">Fecha de pago:</span> ${new Date(payment.date).toLocaleDateString('es-ES')}
            </div>
            <div class="info-row">
              <span class="label">Hora:</span> ${new Date(payment.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div class="info-row">
              <span class="label">Estado:</span> 
              <span class="status-badge status-${payment.status}">
                ${payment.status === 'completado' ? 'COMPLETADO' : 
                  payment.status === 'pendiente' ? 'PENDIENTE' : 
                  'FALLIDO'}
              </span>
            </div>
            ${payment.referencia ? `<div class="info-row">
              <span class="label">Referencia:</span> ${payment.referencia}
            </div>` : ''}
          </div>

          <div class="info-block">
            <h3>Datos del Paciente</h3>
            <div class="info-row">
              <span class="label">Nombre:</span> ${payment.patient}
            </div>
            <div class="info-row">
              <span class="label">Método de pago:</span> ${payment.method}
            </div>
          </div>
        </div>

        <table class="details-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th style="width: 150px; text-align: right;">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${payment.concept}</strong>
                ${payment.notes ? `<br><small style="color: #666;">${payment.notes}</small>` : ''}
              </td>
              <td style="text-align: right; font-size: 18px;">$${payment.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <strong>TOTAL:</strong>
          </div>
          <div class="total-amount">$${payment.amount.toFixed(2)}</div>
        </div>

        <div class="footer">
          <p><strong>Gracias por su pago</strong></p>
          <p>Esta es una factura generada automáticamente por el Sistema de Gestión de Citas</p>
          <p>Para cualquier consulta, por favor contacte con su profesional de la salud</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  } catch (error) {
    console.error('Error generando factura:', error);
    alert('Error al generar la factura');
  }
};

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
                  payment.status === 'completado' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  payment.status === 'fallido' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {payment.status === 'completado' ? 'Completado' : 
                   payment.status === 'pendiente' ? 'Pendiente' : 
                   payment.status === 'fallido' ? 'Fallido' :
                   payment.status?.toUpperCase() || 'DESCONOCIDO'}
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
          <button onClick={() => descargarFactura(payment)} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
            Descargar Factura
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const ProfessionalPayments = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, completed, pending, failed
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState('month'); // week, month, year, all
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    total_count: 0
  });

  React.useEffect(() => {
    cargarDatos();
  }, [dateRange]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Calcular fechas según el rango
      let fechaInicio = null;
      let fechaFin = null;
      
      const now = new Date();
      if (dateRange === 'week') {
        fechaInicio = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'month') {
        fechaInicio = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'year') {
        fechaInicio = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      }
      
      const params = new URLSearchParams();
      if (fechaInicio) {
        params.append('fecha_inicio', fechaInicio.toISOString().split('T')[0]);
      }
      if (fechaFin) {
        params.append('fecha_fin', fechaFin.toISOString().split('T')[0]);
      }
      
      // Cargar pagos
      const responsePagos = await fetch(
        `${API_URL}/api/profesionales/dashboard/pagos?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (responsePagos.ok) {
        const dataPagos = await responsePagos.json();
        setPayments(dataPagos.pagos || []);
      }
      
      // Cargar estadísticas
      const responseEstadisticas = await fetch(
        `${API_URL}/api/profesionales/dashboard/pagos/estadisticas`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (responseEstadisticas.ok) {
        const dataEstadisticas = await responseEstadisticas.json();
        setEstadisticas(dataEstadisticas);
      }
    } catch (error) {
      console.error('Error cargando pagos:', error);
    } finally {
      setLoading(false);
    }
  }

  // Usar estadísticas del backend
  const summary = useMemo(() => {
    return {
      total: estadisticas.total,
      pending: estadisticas.pending,
      failed: estadisticas.failed,
      completed: estadisticas.completed
    };
  }, [estadisticas]);

  // Filtrado
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.concept.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  const exportarCSV = () => {
    try {
      // Crear encabezados
      const headers = ['ID', 'Paciente', 'Fecha', 'Concepto', 'Método', 'Monto', 'Estado'];
      
      // Crear filas de datos
      const rows = filteredPayments.map(p => [
        p.id,
        p.patient,
        new Date(p.date).toLocaleDateString('es-ES'),
        p.concept,
        p.method,
        `$${p.amount.toFixed(2)}`,
        p.status === 'completado' ? 'Completado' : 
        p.status === 'pendiente' ? 'Pendiente' : 
        p.status === 'fallido' ? 'Fallido' : p.status
      ]);
      
      // Combinar encabezados y filas
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // Crear blob y descargar
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pagos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exportando CSV:', error);
      alert('Error al exportar CSV');
    }
  };

  const exportarPDF = () => {
    try {
      // Crear contenido HTML para el PDF
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Pagos</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0891b2; text-align: center; }
            .summary { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .summary-item { display: inline-block; margin: 10px 20px; }
            .summary-label { font-weight: bold; color: #666; }
            .summary-value { font-size: 24px; color: #0891b2; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #0891b2; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background: #f9fafb; }
            .status-completado { color: #059669; font-weight: bold; }
            .status-pendiente { color: #d97706; font-weight: bold; }
            .status-fallido { color: #dc2626; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Reporte de Pagos - Profesional</h1>
          <div style="text-align: center; color: #666; margin-bottom: 20px;">
            Generado el ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Ingresos Totales:</div>
              <div class="summary-value">$${summary.total.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Pendientes:</div>
              <div class="summary-value">$${summary.pending.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Completados:</div>
              <div class="summary-value">${summary.completed}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Fallidos:</div>
              <div class="summary-value">${summary.failed}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Método</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      filteredPayments.forEach(p => {
        const statusClass = p.status === 'completado' ? 'status-completado' : 
                           p.status === 'pendiente' ? 'status-pendiente' : 
                           'status-fallido';
        const statusText = p.status === 'completado' ? 'Completado' : 
                          p.status === 'pendiente' ? 'Pendiente' : 
                          'Fallido';
        
        htmlContent += `
          <tr>
            <td>${p.id}</td>
            <td>${p.patient}</td>
            <td>${new Date(p.date).toLocaleDateString('es-ES')}</td>
            <td>${p.concept}</td>
            <td>${p.method}</td>
            <td>$${p.amount.toFixed(2)}</td>
            <td class="${statusClass}">${statusText}</td>
          </tr>
        `;
      });
      
      htmlContent += `
            </tbody>
          </table>
          
          <div class="footer">
            <p>Total de transacciones: ${filteredPayments.length}</p>
            <p>Sistema de Gestión de Citas - Reporte generado automáticamente</p>
          </div>
        </body>
        </html>
      `;
      
      // Crear ventana de impresión
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que cargue y luego imprimir
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error al exportar PDF');
    }
  };

  const openDetail = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando pagos...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="text-xs text-gray-500 mt-2">{payments.filter(p => p.status === 'pendiente').length} transacciones</div>
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
            <div className="text-xs text-gray-500 mt-2">{estadisticas.total_count > 0 ? ((summary.completed / estadisticas.total_count) * 100).toFixed(0) : 0}% del total</div>
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
                <option value="completado">Completados</option>
                <option value="pendiente">Pendientes</option>
                <option value="fallido">Fallidos</option>
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
              <button onClick={exportarCSV} className="px-4 py-2 bg-white border rounded hover:bg-gray-50 text-sm">
                Exportar CSV
              </button>
              <button onClick={exportarPDF} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm">
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
                        payment.status === 'completado' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'fallido' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status === 'completado' ? 'Completado' : 
                         payment.status === 'pendiente' ? 'Pendiente' : 
                         payment.status === 'fallido' ? 'Fallido' :
                         payment.status.toUpperCase()}
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