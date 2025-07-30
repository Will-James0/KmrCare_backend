import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../_store/auth.js';
import PropTypes from 'prop-types';

/**
 * Composant de protection des routes nécessitant une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 */
const AuthGuard = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuthState();
  const location = useLocation();

  // Affichage de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/authentification" state={{ from: location }} replace />;
  }

  // Vérification du rôle si spécifié
  if (requiredRole && user?.role !== requiredRole) {
    // Redirection vers la page appropriée selon le rôle de l'utilisateur
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'doctor':
        return <Navigate to="/doctor" replace />;
      case 'patient':
        return <Navigate to="/patient" replace />;
      default:
        return <Navigate to="/authentification" replace />;
    }
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

/**
 * Composant de protection pour les admins uniquement
 */
export const AdminGuard = ({ children }) => {
  return (
    <AuthGuard requiredRole="admin">
      {children}
    </AuthGuard>
  );
};

AdminGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Composant de protection pour les médecins uniquement
 */
export const DoctorGuard = ({ children }) => {
  return (
    <AuthGuard requiredRole="doctor">
      {children}
    </AuthGuard>
  );
};

DoctorGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Composant de protection pour les patients uniquement
 */
export const PatientGuard = ({ children }) => {
  return (
    <AuthGuard requiredRole="patient">
      {children}
    </AuthGuard>
  );
};

PatientGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Composant de redirection pour les utilisateurs déjà connectés
 * Utilisé sur la page de connexion pour éviter de se reconnecter
 */
export const GuestGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuthState();

  if (isAuthenticated && user) {
    // Redirection selon le rôle
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'doctor':
        return <Navigate to="/doctor" replace />;
      case 'patient':
        return <Navigate to="/patient" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;
