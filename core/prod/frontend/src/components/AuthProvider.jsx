import { useEffect, useState } from 'react';
import { useAuth } from '../_store/auth';
import PropTypes from 'prop-types';

/**
 * Composant wrapper pour initialiser l'authentification
 * Charge l'état utilisateur depuis les cookies/localStorage au démarrage
 */
const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadUser = useAuth((state) => state.loadUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Charger les données utilisateur depuis les cookies/localStorage
        loadUser();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [loadUser]);

  // Afficher un loader pendant l'initialisation
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#159eec]"></div>
      </div>
    );
  }

  return children;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
