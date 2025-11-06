import Navbar from './components/Navbar';
import Slider from './components/Slider';
import Benefits from './components/Benefits';
import Testimonials from './components/Opinions';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Login from './pages/login_clientes';
import Register from './pages/registro_clientes';
import InicioClientes from './pages/inicio_clientes';
import ClientDashboard from './pages/Dashboard_cliente';
import ClientAppointments from './pages/Citas_cliente';
import ClientFavorites from './pages/Favorites_cliente';
import ProfessionalProfile from './pages/Buscar_porfesional';
import BookAppointment from './pages/Confirmacion_cita';
import Payment from './pages/Pasarela_pago';
import PaymentHistory from './pages/Historial_pagos';
import ClientProfile from './pages/Perfil_clientes';
import InicioProfesional from './pages/inicio_profesional';
import ProfessionalDashboard from './pages/Dashboard_profesional';
import ProfessionalAgenda from './pages/Agenda_profesional';
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
      <Route path="/Buscar_profesional" element={<ProfessionalProfile />} />
      <Route path="/Confirmacion_cita" element={<BookAppointment />} />
      <Route path="/Pasarela_pago" element={<Payment />} />
      {/* Rutas del profesional */}
      <Route path="/inicio_profesional" element={<InicioProfesional />} />
      <Route path="/Dashboard_profesional" element={<ProfessionalDashboard />} />
      <Route path="/profesional" element={<ProfessionalDashboard />} />
      <Route path="/profesional/agenda" element={<ProfessionalAgenda />} />
    </Routes>
  );
}

export default App;