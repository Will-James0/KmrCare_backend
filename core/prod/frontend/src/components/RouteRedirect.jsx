import { useAuthRedirect } from '../hooks/useAuthRedirect';

/**
 * Composant pour gérer les redirections automatiques
 */
const RouteRedirect = () => {
  useAuthRedirect();
  return null;
};

export default RouteRedirect;
