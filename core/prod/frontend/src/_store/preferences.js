import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Store global pour les préférences utilisateur
 * Gère les paramètres personnalisables de l'interface
 */
export const usePreferences = create()(
  devtools(
    persist(
      (set, get) => ({
        // ========================
        // PRÉFÉRENCES D'AFFICHAGE
        // ========================
        theme: 'light', // 'light', 'dark', 'auto'
        language: 'fr', // 'fr', 'en'
        compactMode: false,
        animations: true,
        highContrast: false,

        setTheme: (theme) => set(
          { theme },
          false,
          'setTheme'
        ),

        setLanguage: (language) => set(
          { language },
          false,
          'setLanguage'
        ),

        toggleCompactMode: () => set(
          (state) => ({ compactMode: !state.compactMode }),
          false,
          'toggleCompactMode'
        ),

        setAnimations: (enabled) => set(
          { animations: enabled },
          false,
          'setAnimations'
        ),

        toggleHighContrast: () => set(
          (state) => ({ highContrast: !state.highContrast }),
          false,
          'toggleHighContrast'
        ),

        // ========================
        // PRÉFÉRENCES DE PAGINATION
        // ========================
        itemsPerPage: {
          dispensaires: 8,
          users: 10,
          appointments: 10,
          default: 10
        },

        setItemsPerPage: (category, count) => set(
          (state) => ({
            itemsPerPage: {
              ...state.itemsPerPage,
              [category]: Math.max(5, Math.min(50, count))
            }
          }),
          false,
          'setItemsPerPage'
        ),

        getItemsPerPage: (category) => {
          return get().itemsPerPage[category] || get().itemsPerPage.default;
        },

        // ========================
        // PRÉFÉRENCES DE SIDEBAR
        // ========================
        sidebarCollapsed: false,
        sidebarPinned: true,
        showSidebarIcons: true,

        setSidebarCollapsed: (collapsed) => set(
          { sidebarCollapsed: collapsed },
          false,
          'setSidebarCollapsed'
        ),

        toggleSidebarCollapsed: () => set(
          (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
          false,
          'toggleSidebarCollapsed'
        ),

        setSidebarPinned: (pinned) => set(
          { sidebarPinned: pinned },
          false,
          'setSidebarPinned'
        ),

        toggleSidebarPinned: () => set(
          (state) => ({ sidebarPinned: !state.sidebarPinned }),
          false,
          'toggleSidebarPinned'
        ),

        // ========================
        // PRÉFÉRENCES DE TABLEAUX
        // ========================
        tablePreferences: {
          showGridLines: true,
          zebra: true, // Lignes alternées
          compactRows: false,
          showExportButton: true,
          defaultSort: 'name',
          defaultSortOrder: 'asc'
        },

        setTablePreference: (key, value) => set(
          (state) => ({
            tablePreferences: {
              ...state.tablePreferences,
              [key]: value
            }
          }),
          false,
          'setTablePreference'
        ),

        // ========================
        // PRÉFÉRENCES DE NOTIFICATIONS
        // ========================
        notificationPreferences: {
          showToasts: true,
          autoClose: true,
          position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
          duration: 5000,
          maxVisible: 5,
          playSound: false,
          showOnSuccess: true,
          showOnError: true,
          showOnWarning: true,
          showOnInfo: true
        },

        setNotificationPreference: (key, value) => set(
          (state) => ({
            notificationPreferences: {
              ...state.notificationPreferences,
              [key]: value
            }
          }),
          false,
          'setNotificationPreference'
        ),

        // ========================
        // PRÉFÉRENCES DE DASHBOARD
        // ========================
        dashboardPreferences: {
          showWelcomeMessage: true,
          showQuickStats: true,
          showRecentActivity: true,
          autoRefreshStats: true,
          refreshInterval: 300000, // 5 minutes
          defaultView: 'cards', // 'cards', 'list', 'grid'
          chartsType: 'modern' // 'modern', 'minimal', 'detailed'
        },

        setDashboardPreference: (key, value) => set(
          (state) => ({
            dashboardPreferences: {
              ...state.dashboardPreferences,
              [key]: value
            }
          }),
          false,
          'setDashboardPreference'
        ),

        // ========================
        // PRÉFÉRENCES DE FORMULAIRES
        // ========================
        formPreferences: {
          autoSave: true,
          autoSaveInterval: 30000, // 30 secondes
          confirmBeforeLeaving: true,
          showRequiredIndicators: true,
          inlineValidation: true,
          rememberFormData: true
        },

        setFormPreference: (key, value) => set(
          (state) => ({
            formPreferences: {
              ...state.formPreferences,
              [key]: value
            }
          }),
          false,
          'setFormPreference'
        ),

        // ========================
        // RACCOURCIS CLAVIER
        // ========================
        keyboardShortcuts: {
          enabled: true,
          shortcuts: {
            search: 'Ctrl+K',
            newItem: 'Ctrl+N',
            save: 'Ctrl+S',
            refresh: 'F5',
            toggleSidebar: 'Ctrl+B',
            toggleTheme: 'Ctrl+Shift+T'
          }
        },

        setKeyboardShortcuts: (shortcuts) => set(
          (state) => ({
            keyboardShortcuts: {
              ...state.keyboardShortcuts,
              shortcuts: { ...state.keyboardShortcuts.shortcuts, ...shortcuts }
            }
          }),
          false,
          'setKeyboardShortcuts'
        ),

        toggleKeyboardShortcuts: () => set(
          (state) => ({
            keyboardShortcuts: {
              ...state.keyboardShortcuts,
              enabled: !state.keyboardShortcuts.enabled
            }
          }),
          false,
          'toggleKeyboardShortcuts'
        ),

        // ========================
        // FAVORIS ET RACCOURCIS
        // ========================
        favorites: {
          dispensaires: [],
          users: [],
          quickActions: []
        },

        addToFavorites: (category, item) => set(
          (state) => {
            const currentFavorites = state.favorites[category] || [];
            if (currentFavorites.some(fav => fav.id === item.id)) {
              return state; // Déjà en favoris
            }
            return {
              favorites: {
                ...state.favorites,
                [category]: [...currentFavorites, item]
              }
            };
          },
          false,
          'addToFavorites'
        ),

        removeFromFavorites: (category, itemId) => set(
          (state) => ({
            favorites: {
              ...state.favorites,
              [category]: (state.favorites[category] || []).filter(item => item.id !== itemId)
            }
          }),
          false,
          'removeFromFavorites'
        ),

        isFavorite: (category, itemId) => {
          const favorites = get().favorites[category] || [];
          return favorites.some(item => item.id === itemId);
        },

        // ========================
        // HISTORIQUE ET RÉCENTS
        // ========================
        recentItems: {
          dispensaires: [],
          users: [],
          appointments: [],
          maxItems: 10
        },

        addToRecent: (category, item) => set(
          (state) => {
            const current = state.recentItems[category] || [];
            const filtered = current.filter(recent => recent.id !== item.id);
            const updated = [item, ...filtered].slice(0, state.recentItems.maxItems);
            
            return {
              recentItems: {
                ...state.recentItems,
                [category]: updated
              }
            };
          },
          false,
          'addToRecent'
        ),

        clearRecent: (category) => set(
          (state) => ({
            recentItems: {
              ...state.recentItems,
              [category]: []
            }
          }),
          false,
          'clearRecent'
        ),

        // ========================
        // GESTION DES PROFILS
        // ========================
        profiles: {
          current: 'default',
          saved: {
            default: {
              name: 'Par défaut',
              description: 'Configuration par défaut'
            }
          }
        },

        saveCurrentAsProfile: (name, description = '') => {
          const currentState = get();
          const profile = {
            name,
            description,
            preferences: {
              theme: currentState.theme,
              compactMode: currentState.compactMode,
              itemsPerPage: currentState.itemsPerPage,
              sidebarCollapsed: currentState.sidebarCollapsed,
              tablePreferences: currentState.tablePreferences,
              notificationPreferences: currentState.notificationPreferences,
              dashboardPreferences: currentState.dashboardPreferences
            },
            createdAt: new Date().toISOString()
          };

          set(
            (state) => ({
              profiles: {
                ...state.profiles,
                saved: {
                  ...state.profiles.saved,
                  [name]: profile
                }
              }
            }),
            false,
            'saveCurrentAsProfile'
          );
        },

        loadProfile: (profileName) => {
          const profile = get().profiles.saved[profileName];
          if (!profile) return;

          const { preferences } = profile;
          set(
            {
              ...preferences,
              profiles: {
                ...get().profiles,
                current: profileName
              }
            },
            false,
            'loadProfile'
          );
        },

        deleteProfile: (profileName) => {
          if (profileName === 'default') return; // Ne pas supprimer le profil par défaut

          set(
            (state) => {
              const newSaved = { ...state.profiles.saved };
              delete newSaved[profileName];
              
              return {
                profiles: {
                  current: state.profiles.current === profileName ? 'default' : state.profiles.current,
                  saved: newSaved
                }
              };
            },
            false,
            'deleteProfile'
          );
        },

        // ========================
        // RÉINITIALISATION
        // ========================
        resetToDefaults: () => set(
          {
            theme: 'light',
            language: 'fr',
            compactMode: false,
            animations: true,
            highContrast: false,
            sidebarCollapsed: false,
            sidebarPinned: true,
            showSidebarIcons: true,
            itemsPerPage: {
              dispensaires: 8,
              users: 10,
              appointments: 10,
              default: 10
            },
            tablePreferences: {
              showGridLines: true,
              zebra: true,
              compactRows: false,
              showExportButton: true,
              defaultSort: 'name',
              defaultSortOrder: 'asc'
            },
            notificationPreferences: {
              showToasts: true,
              autoClose: true,
              position: 'top-right',
              duration: 5000,
              maxVisible: 5,
              playSound: false,
              showOnSuccess: true,
              showOnError: true,
              showOnWarning: true,
              showOnInfo: true
            },
            dashboardPreferences: {
              showWelcomeMessage: true,
              showQuickStats: true,
              showRecentActivity: true,
              autoRefreshStats: true,
              refreshInterval: 300000,
              defaultView: 'cards',
              chartsType: 'modern'
            },
            formPreferences: {
              autoSave: true,
              autoSaveInterval: 30000,
              confirmBeforeLeaving: true,
              showRequiredIndicators: true,
              inlineValidation: true,
              rememberFormData: true
            }
          },
          false,
          'resetToDefaults'
        ),

        // ========================
        // IMPORT/EXPORT
        // ========================
        exportPreferences: () => {
          const state = get();
          return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            preferences: {
              theme: state.theme,
              language: state.language,
              compactMode: state.compactMode,
              animations: state.animations,
              highContrast: state.highContrast,
              itemsPerPage: state.itemsPerPage,
              sidebarCollapsed: state.sidebarCollapsed,
              sidebarPinned: state.sidebarPinned,
              tablePreferences: state.tablePreferences,
              notificationPreferences: state.notificationPreferences,
              dashboardPreferences: state.dashboardPreferences,
              formPreferences: state.formPreferences,
              keyboardShortcuts: state.keyboardShortcuts,
              favorites: state.favorites
            }
          };
        },

        importPreferences: (data) => {
          if (!data || !data.preferences) return false;

          try {
            const { preferences } = data;
            set(
              {
                ...preferences
              },
              false,
              'importPreferences'
            );
            return true;
          } catch (error) {
            console.error('Erreur lors de l\'import des préférences:', error);
            return false;
          }
        }
      }),
      {
        name: 'user-preferences',
        // Persister toutes les préférences
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          compactMode: state.compactMode,
          animations: state.animations,
          highContrast: state.highContrast,
          itemsPerPage: state.itemsPerPage,
          sidebarCollapsed: state.sidebarCollapsed,
          sidebarPinned: state.sidebarPinned,
          showSidebarIcons: state.showSidebarIcons,
          tablePreferences: state.tablePreferences,
          notificationPreferences: state.notificationPreferences,
          dashboardPreferences: state.dashboardPreferences,
          formPreferences: state.formPreferences,
          keyboardShortcuts: state.keyboardShortcuts,
          favorites: state.favorites,
          recentItems: state.recentItems,
          profiles: state.profiles
        })
      }
    ),
    {
      name: 'preferences-store'
    }
  )
);

// ========================
// HOOKS UTILITAIRES
// ========================

// Hook pour le thème
export const useTheme = () => {
  const { theme, setTheme, highContrast, toggleHighContrast } = usePreferences();
  
  return {
    theme,
    setTheme,
    highContrast,
    toggleHighContrast,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isAuto: theme === 'auto'
  };
};

// Hook pour les préférences de tableau
export const useTablePreferences = () => {
  const { tablePreferences, setTablePreference } = usePreferences();
  
  return {
    preferences: tablePreferences,
    setPreference: setTablePreference
  };
};

// Hook pour les favoris
export const useFavorites = (category) => {
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = usePreferences();
  
  return {
    items: favorites[category] || [],
    add: (item) => addToFavorites(category, item),
    remove: (itemId) => removeFromFavorites(category, itemId),
    isFavorite: (itemId) => isFavorite(category, itemId),
    toggle: (item) => {
      if (isFavorite(category, item.id)) {
        removeFromFavorites(category, item.id);
      } else {
        addToFavorites(category, item);
      }
    }
  };
};

// Hook pour les éléments récents
export const useRecent = (category) => {
  const { recentItems, addToRecent, clearRecent } = usePreferences();
  
  return {
    items: recentItems[category] || [],
    add: (item) => addToRecent(category, item),
    clear: () => clearRecent(category)
  };
};

// Support HMR pour Vite
if (import.meta.hot) {
  import.meta.hot.accept();
}
