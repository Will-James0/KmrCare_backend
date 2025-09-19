/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useUI, useNotify, useData, useAuth } from '../_store';

/**
 * Hook combiné pour l'interface administrateur
 * Regroupe les fonctionnalités les plus utilisées dans l'admin
 */
export const useAdmin = () => {
  const {
    getActiveTab,
    setActiveTab,
    isSidebarOpen,
    toggleSidebar
  } = useUI();
  
  const notify = useNotify();
  
  const {
    users,
    dispensaires,
    appointments,
    getStats
  } = useData();
  
  const {
    user,
    isAdmin,
    clearUser
  } = useAuth();

  return {
    // Interface
    activeTab: getActiveTab('admin'),
    setActiveTab: (tab) => setActiveTab('admin', tab),
    isSidebarOpen,
    toggleSidebar,
    
    // Données
    users,
    dispensaires,
    appointments,
    stats: getStats('admin'),
    
    // Notifications
    notify,
    
    // Auth
    user,
    isAdmin: isAdmin(),
    logout: clearUser
  };
};

/**
 * Hook combiné pour l'interface docteur
 */
export const useDoctor = () => {
  const {
    getActiveTab,
    setActiveTab
  } = useUI();
  
  const notify = useNotify();
  
  const {
    appointments,
    getStats
  } = useData();
  
  const {
    user,
    isDoctor
  } = useAuth();

  return {
    // Interface
    activeTab: getActiveTab('doctor'),
    setActiveTab: (tab) => setActiveTab('doctor', tab),
    
    // Données
    appointments,
    stats: getStats('doctor'),
    
    // Notifications
    notify,
    
    // Auth
    user,
    isDoctor: isDoctor()
  };
};

/**
 * Hook pour la gestion centralisée des erreurs API
 */
export const useApiErrorHandler = () => {
  const { error } = useNotify();
  const { clearUser } = useAuth();

  const handleApiError = (err, context = '') => {
    // Gestion spéciale pour les erreurs d'authentification
    if (err?.response?.status === 401) {
      clearUser();
      error('Session expirée. Veuillez vous reconnecter.');
      return;
    }

    // Gestion des autres erreurs
    let message = 'Une erreur est survenue';
    
    if (typeof err === 'string') {
      message = err;
    } else if (err?.response?.data?.message) {
      message = err.response.data.message;
    } else if (err?.message) {
      message = err.message;
    }

    if (context) {
      message = `Erreur ${context}: ${message}`;
    }

    error(message, {
      duration: 8000,
      persistent: err?.response?.status >= 500 // Erreurs serveur persistantes
    });
  };

  return { handleApiError };
};

/**
 * Hook combiné pour les listes avec recherche, filtres et pagination
 */
export const useListManagement = (category) => {
  const {
    filters,
    setFilter,
    resetFilters,
    getPagination,
    setCurrentPage,
    setPagination
  } = useUI();
  
  const { getItemsPerPage, compactMode, tablePreferences } = usePreferences();

  const categoryFilters = filters[category] || {};
  const pagination = getPagination(category);

  return {
    // Filtres
    filters: categoryFilters,
    setFilter: (key, value) => setFilter(category, key, value),
    resetFilters: () => resetFilters(category),
    
    // Pagination
    currentPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    setCurrentPage: (page) => setCurrentPage(category, page),
    setPagination: (page, itemsPerPage) => setPagination(category, page, itemsPerPage),
    
    // Préférences d'affichage
    compactMode,
    showGridLines: tablePreferences.showGridLines
  };
};
