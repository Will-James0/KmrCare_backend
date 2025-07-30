import { Navigate } from 'react-router-dom';
import { useAuth } from '../_store/auth';
import PropTypes from 'prop-types';

/**
 * Guard pour protéger les routes administrateur
 * Redirige vers la page d'accueil si l'utilisateur n'est pas admin
 */
const AdminGuard = ({ children }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const isAdmin = useAuth((state) => state.isAdmin());

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

AdminGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminGuard;
