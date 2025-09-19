import { Navigate } from 'react-router-dom';
import { useAuth } from '../_store/auth';
import PropTypes from 'prop-types';

/**
 * Guard pour rediriger les utilisateurs déjà connectés
 * Utilisé pour les pages de connexion/inscription
 */
const GuestGuard = ({ children }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const userRole = useAuth((state) => state.getUserRole());

  if (isAuthenticated) {
    // Rediriger vers la page appropriée selon le rôle
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'doctor':
        return <Navigate to="/doctors" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestGuard;
