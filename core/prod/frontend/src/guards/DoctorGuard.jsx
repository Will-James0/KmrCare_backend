import { Navigate } from 'react-router-dom';
import { useAuth } from '../_store/auth';
import PropTypes from 'prop-types';

/**
 * Guard pour protéger les routes des docteurs
 * Redirige vers la page d'accueil si l'utilisateur n'est pas docteur
 */
const DoctorGuard = ({ children }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const isDoctor = useAuth((state) => state.isDoctor());

  if (!isAuthenticated) {
    return <Navigate to="/login-doctor" replace />;
  }

  if (!isDoctor) {
    return <Navigate to="/login-doctor" replace />;
  }

  return children;
};

DoctorGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DoctorGuard;
