import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Store global pour la gestion de l'interface utilisateur
 * Centralise les états de l'UI partagés entre composants
 */
export const useUI = create()(
  devtools(
    (set, get) => ({
      // ========================
      // SIDEBAR ET NAVIGATION
      // ========================
      isSidebarOpen: false,
      sidebarCollapsed: false,
      
      toggleSidebar: () => set(
        (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
        false,
        'toggleSidebar'
      ),
      
      setSidebarOpen: (isOpen) => set(
        { isSidebarOpen: isOpen },
        false,
        'setSidebarOpen'
      ),
      
      toggleSidebarCollapse: () => set(
        (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
        false,
        'toggleSidebarCollapse'
      ),

      // ========================
      // ONGLETS ACTIFS
      // ========================
      activeTab: {
        admin: 'users',
        doctor: 'medecins',
        catalogue: 'tous'
      },
      
      setActiveTab: (page, tab) => set(
        (state) => ({
          activeTab: { ...state.activeTab, [page]: tab }
        }),
        false,
        'setActiveTab'
      ),
      
      getActiveTab: (page) => get().activeTab[page] || 'default',

      // ========================
      // MODALES
      // ========================
      modals: {},
      
      showModal: (id, data = null) => set(
        (state) => ({
          modals: { 
            ...state.modals, 
            [id]: { isOpen: true, data, timestamp: Date.now() } 
          }
        }),
        false,
        'showModal'
      ),
      
      hideModal: (id) => set(
        (state) => ({
          modals: { 
            ...state.modals, 
            [id]: { isOpen: false, data: null, timestamp: null } 
          }
        }),
        false,
        'hideModal'
      ),
      
      isModalOpen: (id) => get().modals[id]?.isOpen || false,
      getModalData: (id) => get().modals[id]?.data || null,
      
      hideAllModals: () => set(
        { modals: {} },
        false,
        'hideAllModals'
      ),

      // ========================
      // ÉTATS DE CHARGEMENT
      // ========================
      loading: {},
      
      setLoading: (key, status) => set(
        (state) => ({
          loading: { ...state.loading, [key]: status }
        }),
        false,
        'setLoading'
      ),
      
      isLoading: (key) => get().loading[key] || false,
      
      clearAllLoading: () => set(
        { loading: {} },
        false,
        'clearAllLoading'
      ),

      // ========================
      // RECHERCHE ET FILTRES
      // ========================
      filters: {
        dispensaires: { search: '', status: 'all', arrondissement: 'Tous' },
        users: { search: '', role: 'all', status: 'all' },
        appointments: { search: '', date: '', status: 'all' }
      },
      
      setFilter: (category, key, value) => set(
        (state) => ({
          filters: {
            ...state.filters,
            [category]: { 
              ...state.filters[category], 
              [key]: value 
            }
          }
        }),
        false,
        'setFilter'
      ),
      
      getFilter: (category, key) => get().filters[category]?.[key] || '',
      
      resetFilters: (category) => set(
        (state) => ({
          filters: {
            ...state.filters,
            [category]: Object.keys(state.filters[category]).reduce((acc, key) => {
              acc[key] = key === 'search' ? '' : 'all';
              return acc;
            }, {})
          }
        }),
        false,
        'resetFilters'
      ),

      // ========================
      // PAGINATION
      // ========================
      pagination: {
        dispensaires: { currentPage: 1, itemsPerPage: 8 },
        users: { currentPage: 1, itemsPerPage: 10 },
        appointments: { currentPage: 1, itemsPerPage: 10 }
      },
      
      setPagination: (category, page, itemsPerPage) => set(
        (state) => ({
          pagination: {
            ...state.pagination,
            [category]: { currentPage: page, itemsPerPage }
          }
        }),
        false,
        'setPagination'
      ),
      
      setCurrentPage: (category, page) => set(
        (state) => ({
          pagination: {
            ...state.pagination,
            [category]: { 
              ...state.pagination[category], 
              currentPage: page 
            }
          }
        }),
        false,
        'setCurrentPage'
      ),
      
      getPagination: (category) => get().pagination[category] || { currentPage: 1, itemsPerPage: 10 },

      // ========================
      // PRÉFÉRENCES D'AFFICHAGE
      // ========================
      viewPreferences: {
        theme: 'light',
        compactMode: false,
        showStats: true
      },
      
      setViewPreference: (key, value) => set(
        (state) => ({
          viewPreferences: {
            ...state.viewPreferences,
            [key]: value
          }
        }),
        false,
        'setViewPreference'
      ),
      
      toggleCompactMode: () => set(
        (state) => ({
          viewPreferences: {
            ...state.viewPreferences,
            compactMode: !state.viewPreferences.compactMode
          }
        }),
        false,
        'toggleCompactMode'
      ),

      // ========================
      // MÉTHODES UTILITAIRES
      // ========================
      resetUI: () => set(
        {
          isSidebarOpen: false,
          sidebarCollapsed: false,
          modals: {},
          loading: {},
          activeTab: {
            admin: 'users',
            doctor: 'medecins',
            catalogue: 'tous'
          }
        },
        false,
        'resetUI'
      )
    }),
    {
      name: 'ui-store'
    }
  )
);

// ========================
// HOOKS UTILITAIRES
// ========================

// Hook pour la gestion des modales
export const useModal = (modalId) => {
  const { showModal, hideModal, isModalOpen, getModalData } = useUI();
  
  return {
    isOpen: isModalOpen(modalId),
    data: getModalData(modalId),
    show: (data) => showModal(modalId, data),
    hide: () => hideModal(modalId)
  };
};

// Hook pour la gestion du chargement
export const useLoading = (key) => {
  const { setLoading, isLoading } = useUI();
  
  return {
    isLoading: isLoading(key),
    setLoading: (status) => setLoading(key, status)
  };
};

// Hook pour la gestion des filtres
export const useFilters = (category) => {
  const { filters, setFilter, resetFilters } = useUI();
  
  return {
    filters: filters[category] || {},
    setFilter: (key, value) => setFilter(category, key, value),
    resetFilters: () => resetFilters(category)
  };
};

// Hook pour la pagination
export const usePagination = (category) => {
  const { pagination, setCurrentPage, setPagination } = useUI();
  
  return {
    ...pagination[category],
    setCurrentPage: (page) => setCurrentPage(category, page),
    setPagination: (page, itemsPerPage) => setPagination(category, page, itemsPerPage)
  };
};

// Support HMR pour Vite
if (import.meta.hot) {
  import.meta.hot.accept();
}
