/**
 * Point d'entrée centralisé pour tous les stores de l'application
 * Facilite l'import et la gestion des dépendances
 */

// ========================
// STORES PRINCIPAUX
// ========================

// Store d'authentification (existant)
export {
  useAuth,
  useAuthInit,
  useAuthUser,
  useIsAuthenticated,
  useUserRole
} from './auth.js';

// Store de l'interface utilisateur
export {
  useUI,
  useModal,
  useLoading,
  useFilters,
  usePagination
} from './ui.js';

// Store des notifications
export {
  useNotifications,
  useNotify,
  useApiNotifications,
  useNotification
} from './notifications.js';

// Store des données partagées
export {
  useData,
  useDispensaires,
  useUsers,
  useAppointments,
  useStats
} from './data.js';

// Store des préférences utilisateur
export {
  usePreferences,
  useTheme,
  useTablePreferences,
  useFavorites,
  useRecent
} from './preferences.js';

// ========================
// UTILITAIRES GLOBAUX
// ========================

/**
 * Fonction pour initialiser tous les stores au démarrage de l'application
 * Utilise les imports dynamiques pour éviter les dépendances circulaires
 */
export const initializeStores = async () => {
  try {
    // Import dynamique pour éviter les dépendances circulaires
    const { useAuth } = await import('./auth.js');
    const { useData } = await import('./data.js');
    
    // Initialiser l'authentification
    const authStore = useAuth.getState();
    authStore.loadUser();

    // Calculer les statistiques initiales si des données sont présentes
    const dataStore = useData.getState();
    if (dataStore.dispensaires.length > 0 || dataStore.users.length > 0) {
      dataStore.calculateStats();
    }

    console.log('🏪 Stores initialisés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des stores:', error);
  }
};

/**
 * Fonction pour nettoyer tous les stores (utile pour les tests ou la déconnexion)
 */
export const clearAllStores = async () => {
  try {
    const { useAuth } = await import('./auth.js');
    const { useData } = await import('./data.js');
    const { useUI } = await import('./ui.js');
    const { useNotifications } = await import('./notifications.js');
    
    useAuth.getState().clearUser();
    useData.getState().clearAllData();
    useUI.getState().resetUI();
    useNotifications.getState().clearAllNotifications();
    
    console.log('🧹 Stores nettoyés');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des stores:', error);
  }
};

/**
 * Fonction pour obtenir un snapshot de l'état global (debugging)
 */
export const getGlobalState = async () => {
  try {
    const { useAuth } = await import('./auth.js');
    const { useUI } = await import('./ui.js');
    const { useNotifications } = await import('./notifications.js');
    const { useData } = await import('./data.js');
    const { usePreferences } = await import('./preferences.js');
    
    return {
      auth: useAuth.getState(),
      ui: useUI.getState(),
      notifications: useNotifications.getState(),
      data: useData.getState(),
      preferences: usePreferences.getState(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'état global:', error);
    return null;
  }
};

// ========================
// TYPES ET CONSTANTES
// ========================

export const STORE_NAMES = {
  AUTH: 'auth',
  UI: 'ui',
  NOTIFICATIONS: 'notifications',
  DATA: 'data',
  PREFERENCES: 'preferences'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
  CONFIRM: 'confirm',
  PROGRESS: 'progress'
};

export const UI_THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient'
};
