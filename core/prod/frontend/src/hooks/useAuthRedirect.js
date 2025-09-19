import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../_store/auth';

/**
 * Hook pour gérer les redirections automatiques après connexion
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const userRole = useAuth((state) => state.getUserRole());

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/auth') {
      // Récupérer la route d'origine ou rediriger selon le rôle
      const from = location.state?.from?.pathname || getDefaultRoute(userRole);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, userRole, location, navigate]);
};

/**
 * Fonction utilitaire pour obtenir la route par défaut selon le rôle
 */
export const getDefaultRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'doctor':
      return '/doctors';
    case 'patient':
    case 'user':
      return '/patient';
    default:
      return '/';
  }
};
