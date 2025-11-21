import Navbar from './components/Navbar';
import Slider from './components/Slider';
import Benefits from './components/Benefits';
import Testimonials from './components/Opinions';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
// Rutas del cliente
import Login from './pages/login_clientes';
import Register from './pages/registro_clientes';
import InicioClientes from './pages/inicio_clientes';
import ClientDashboard from './pages/Dashboard_cliente';
import ClientAppointments from './pages/Citas_cliente';
import ClientFavorites from './pages/Favorites_cliente';
import ProfessionalSearch from './pages/Buscar_porfesional';
import BookAppointment from './pages/Confirmacion_cita';
import Payment from './pages/Pasarela_pago';
import PaymentHistory from './pages/Historial_pagos';
import ClientProfile from './pages/Perfil_clientes';
import NotificacionesCliente from './pages/Notificaciones_cliente';
import PagoCompletado from './pages/Pago_completado';
import PagoCancelado from './pages/Pago_cancelado';
// Rutas del profesional
import ProfessionalAppointments from './pages/inicio_profesional';
import ProfessionalDashboard from './pages/Panelcitas_profesional';
import Agenda_profesional from './pages/Agenda_profesional';
import ProfessionalPatients from './pages/Paciente_profesional';
import ProfessionalPayments from './pages/Pagos_profesional';
import ProfessionalProfile from './pages/perfil_profesional';
// Rutas del administrador
import InicioAdmin from './pages/inicio_admin';
import DashboardAdmin from './pages/Dashboard_admin';
import AdminProfessionals from './pages/Admin_profesionales';
import AdminPatients from './pages/Admin_pacientes';
import AdminAppointments from './pages/Admin_citas';
import { Routes, Route } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Slider />
      </div>
      <Benefits />
      <Testimonials />
      <FAQ />
      <Footer /> 
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      {/* Rutas de autenticación */}
      <Route path="/login_clientes" element={<Login />} />
      <Route path="/registro_clientes" element={<Register />} />
      {/* Rutas del cliente */}
      <Route path="/Dashboard_cliente" element={<ClientDashboard />} />
      <Route path="/inicio_clientes" element={<InicioClientes />} />
      {/* Cliente routes */}
      <Route path="/cliente" element={<InicioClientes />} />
      <Route path="/cliente/citas" element={<ClientAppointments />} />
      <Route path="/cliente/favoritos" element={<ClientFavorites />} />
      <Route path="/cliente/pagos" element={<PaymentHistory />} />
      <Route path="/cliente/perfil" element={<ClientProfile />} />
      <Route path="/cliente/notificaciones" element={<NotificacionesCliente />} />
      <Route path="/Buscar_profesional" element={<ProfessionalSearch />} />
      <Route path="/Confirmacion_cita" element={<BookAppointment />} />
      <Route path="/Pasarela_pago" element={<Payment />} />
      <Route path="/pago-completado" element={<PagoCompletado />} />
      <Route path="/pago-cancelado" element={<PagoCancelado />} />
      {/* Rutas del profesional */}
      <Route path="/inicio_profesional" element={<ProfessionalAppointments />} />
      <Route path="/Panelcitas_profesional" element={<ProfessionalDashboard />} />
      <Route path="/profesional/dashboard" element={<ProfessionalDashboard />} />
       <Route path="/profesional/agenda" element={<Agenda_profesional />} />
      <Route path="/profesional/pacientes" element={<ProfessionalPatients />} />
      <Route path="/profesional/pagos" element={<ProfessionalPayments />} />
      <Route path="/profesional/perfil" element={<ProfessionalProfile />} />
      {/* Rutas del administrador */}
      <Route path="/inicio_admin" element={<InicioAdmin />} />
      <Route path="/Dashboard_admin" element={<DashboardAdmin />} />
      <Route path="/admin/profesionales" element={<AdminProfessionals />} />
      <Route path="/admin/pacientes" element={<AdminPatients />} />
      <Route path="/admin/citas" element={<AdminAppointments />} />
    </Routes>
  );
}

export default App;