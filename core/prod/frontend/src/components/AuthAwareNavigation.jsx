import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../_store/auth';
import { getDefaultRoute } from '../hooks/useAuthRedirect';

/**
 * Composant de navigation intelligent qui s'adapte selon l'état d'authentification
 */
const AuthAwareNavigation = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const userRole = useAuth((state) => state.getUserRole());
  const userName = useAuth((state) => state.getUserName());
  const clearUser = useAuth((state) => state.clearUser);

  const handleLogout = () => {
    clearUser();
    navigate('/', { replace: true });
  };

  const getDashboardLink = () => {
    return getDefaultRoute(userRole);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'doctor':
        return 'Médecin';
      case 'patient':
        return 'Patient';
      default:
        return 'Utilisateur';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/assets/logo.png" alt="KmrCare" className="h-8" />
          </Link>

          {/* Navigation principale */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#159eec] transition-colors">
              Accueil
            </Link>
            <Link to="/catalogue" className="text-gray-700 hover:text-[#159eec] transition-colors">
              Services
            </Link>
            <Link to="/en-savoir-plus" className="text-gray-700 hover:text-[#159eec] transition-colors">
              En savoir plus
            </Link>
            
            {/* Liens conditionnels selon l'authentification */}
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-[#159eec] transition-colors"
                >
                  Tableau de bord
                </Link>
                {userRole === 'patient' && (
                  <Link 
                    to="/reservations" 
                    className="text-gray-700 hover:text-[#159eec] transition-colors"
                  >
                    Mes rendez-vous
                  </Link>
                )}
              </>
            ) : (
              <Link to="/reservations" className="text-gray-700 hover:text-[#159eec] transition-colors">
                Prendre rendez-vous
              </Link>
            )}
          </div>

          {/* Section utilisateur */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#159eec] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{getRoleLabel(userRole)}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-[#159eec] transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-[#159eec] text-white px-4 py-2 rounded-lg hover:bg-[#1384c7] transition-colors text-sm font-medium"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthAwareNavigation;
