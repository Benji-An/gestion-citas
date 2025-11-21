import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '../api';

/**
 * Componente para proteger rutas que requieren autenticación
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  // Si no está autenticado, redirigir al login
  if (!authenticated) {
    return <Navigate to="/login_clientes" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirigir
  if (requiredRole && user && user.tipo_usuario !== requiredRole) {
    // Redirigir al dashboard apropiado según el tipo de usuario
    switch (user.tipo_usuario) {
      case 'cliente':
        return <Navigate to="/inicio_clientes" replace />;
      case 'profesional':
        return <Navigate to="/inicio_profesional" replace />;
      case 'admin':
        return <Navigate to="/inicio_admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
