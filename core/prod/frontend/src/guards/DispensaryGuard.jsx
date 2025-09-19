import { Navigate } from 'react-router-dom';
import { useAuth } from '../_store/auth';
import PropTypes from 'prop-types';

/**
 * Guard pour protéger les routes des propriétaires de dispensaires
 * Redirige vers la page d'accueil si l'utilisateur n'est pas propriétaire de dispensaire
 */
const DispensaryGuard = ({ children }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const isDispensaryOwner = useAuth((state) => state.isDispensaryOwner());

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isDispensaryOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

DispensaryGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DispensaryGuard;
