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
    </Routes>
  );
}

export default App;