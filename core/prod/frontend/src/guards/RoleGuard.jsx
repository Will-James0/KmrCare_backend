import { useAuth } from '../_store/auth';
import PropTypes from 'prop-types';

/**
 * Guard basé sur les rôles utilisateur
 * Permet un contrôle granulaire des permissions
 */
const RoleGuard = ({ children, allowedRoles, fallbackComponent = null }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const userRole = useAuth((state) => state.getUserRole());

  if (!isAuthenticated) {
    return fallbackComponent || <div className="text-center p-8">Accès non autorisé - Connexion requise</div>;
  }

  if (!allowedRoles.includes(userRole)) {
    return fallbackComponent || <div className="text-center p-8">Accès non autorisé - Permissions insuffisantes</div>;
  }

  return children;
};

RoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  fallbackComponent: PropTypes.node,
};

export default RoleGuard;
