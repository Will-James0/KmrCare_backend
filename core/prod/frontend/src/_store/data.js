import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Store global pour la gestion des données partagées et du cache
 * Centralise les données API et évite les rechargements inutiles
 */
export const useData = create()(
  devtools(
    persist(
      (set, get) => ({
        // ========================
        // CACHE DES DISPENSAIRES
        // ========================
        dispensaires: [],
        dispensairesLoaded: false,
        dispensairesLastFetch: null,
        
        setDispensaires: (data) => set(
          {
            dispensaires: data,
            dispensairesLoaded: true,
            dispensairesLastFetch: Date.now()
          },
          false,
          'setDispensaires'
        ),

        addDispensaire: (dispensaire) => set(
          (state) => ({
            dispensaires: [...state.dispensaires, dispensaire]
          }),
          false,
          'addDispensaire'
        ),

        updateDispensaire: (id, updates) => set(
          (state) => ({
            dispensaires: state.dispensaires.map(d =>
              d.id === id ? { ...d, ...updates } : d
            )
          }),
          false,
          'updateDispensaire'
        ),

        removeDispensaire: (id) => set(
          (state) => ({
            dispensaires: state.dispensaires.filter(d => d.id !== id)
          }),
          false,
          'removeDispensaire'
        ),

        getDispensaire: (id) => {
          return get().dispensaires.find(d => d.id === id) || null;
        },

        // ========================
        // CACHE DES UTILISATEURS
        // ========================
        users: [],
        usersLoaded: false,
        usersLastFetch: null,

        setUsers: (data) => set(
          {
            users: data,
            usersLoaded: true,
            usersLastFetch: Date.now()
          },
          false,
          'setUsers'
        ),

        addUser: (user) => set(
          (state) => ({
            users: [...state.users, user]
          }),
          false,
          'addUser'
        ),

        updateUser: (id, updates) => set(
          (state) => ({
            users: state.users.map(u =>
              u.id === id ? { ...u, ...updates } : u
            )
          }),
          false,
          'updateUser'
        ),

        removeUser: (id) => set(
          (state) => ({
            users: state.users.filter(u => u.id !== id)
          }),
          false,
          'removeUser'
        ),

        getUser: (id) => {
          return get().users.find(u => u.id === id) || null;
        },

        // ========================
        // CACHE DES RENDEZ-VOUS
        // ========================
        appointments: [],
        appointmentsLoaded: false,
        appointmentsLastFetch: null,

        setAppointments: (data) => set(
          {
            appointments: data,
            appointmentsLoaded: true,
            appointmentsLastFetch: Date.now()
          },
          false,
          'setAppointments'
        ),

        addAppointment: (appointment) => set(
          (state) => ({
            appointments: [...state.appointments, appointment]
          }),
          false,
          'addAppointment'
        ),

        updateAppointment: (id, updates) => set(
          (state) => ({
            appointments: state.appointments.map(a =>
              a.id === id ? { ...a, ...updates } : a
            )
          }),
          false,
          'updateAppointment'
        ),

        removeAppointment: (id) => set(
          (state) => ({
            appointments: state.appointments.filter(a => a.id !== id)
          }),
          false,
          'removeAppointment'
        ),

        getAppointment: (id) => {
          return get().appointments.find(a => a.id === id) || null;
        },

        // ========================
        // STATISTIQUES GLOBALES
        // ========================
        stats: {
          admin: {
            totalUsers: 0,
            totalAppointments: 0,
            totalDispensaries: 0,
            activeUsers: 0,
            pendingAppointments: 0,
            lastUpdated: null
          },
          doctor: {
            totalPatients: 0,
            todayAppointments: 0,
            weekAppointments: 0,
            lastUpdated: null
          },
          global: {
            totalConsultations: 0,
            activeDispensaries: 0,
            lastUpdated: null
          }
        },

        setStats: (category, data) => set(
          (state) => ({
            stats: {
              ...state.stats,
              [category]: {
                ...data,
                lastUpdated: Date.now()
              }
            }
          }),
          false,
          'setStats'
        ),

        getStats: (category) => {
          return get().stats[category] || {};
        },

        // ========================
        // GESTION DU CACHE
        // ========================
        cacheExpiry: 5 * 60 * 1000, // 5 minutes

        isCacheExpired: (lastFetch) => {
          if (!lastFetch) return true;
          return (Date.now() - lastFetch) > get().cacheExpiry;
        },

        needsRefresh: (type) => {
          const state = get();
          switch (type) {
            case 'dispensaires':
              return !state.dispensairesLoaded || state.isCacheExpired(state.dispensairesLastFetch);
            case 'users':
              return !state.usersLoaded || state.isCacheExpired(state.usersLastFetch);
            case 'appointments':
              return !state.appointmentsLoaded || state.isCacheExpired(state.appointmentsLastFetch);
            default:
              return true;
          }
        },

        invalidateCache: (type = 'all') => {
          if (type === 'all' || type === 'dispensaires') {
            set({ dispensairesLoaded: false, dispensairesLastFetch: null });
          }
          if (type === 'all' || type === 'users') {
            set({ usersLoaded: false, usersLastFetch: null });
          }
          if (type === 'all' || type === 'appointments') {
            set({ appointmentsLoaded: false, appointmentsLastFetch: null });
          }
        },

        // ========================
        // MÉTHODES DE RECHERCHE
        // ========================
        searchDispensaires: (query, filters = {}) => {
          const dispensaires = get().dispensaires;
          return dispensaires.filter(dispensaire => {
            // Recherche textuelle
            const matchesQuery = !query || 
              dispensaire.nom.toLowerCase().includes(query.toLowerCase()) ||
              dispensaire.quartier.toLowerCase().includes(query.toLowerCase()) ||
              dispensaire.arrondissement.toLowerCase().includes(query.toLowerCase());

            // Filtres
            const matchesStatus = !filters.status || filters.status === 'all' || 
              dispensaire.status === filters.status;
            
            const matchesArrondissement = !filters.arrondissement || 
              filters.arrondissement === 'Tous' || 
              dispensaire.arrondissement === filters.arrondissement;

            return matchesQuery && matchesStatus && matchesArrondissement;
          });
        },

        searchUsers: (query, filters = {}) => {
          const users = get().users;
          return users.filter(user => {
            const matchesQuery = !query ||
              user.name.toLowerCase().includes(query.toLowerCase()) ||
              user.email.toLowerCase().includes(query.toLowerCase());

            const matchesRole = !filters.role || filters.role === 'all' || 
              user.role === filters.role;

            const matchesStatus = !filters.status || filters.status === 'all' || 
              user.status === filters.status;

            return matchesQuery && matchesRole && matchesStatus;
          });
        },

        searchAppointments: (query, filters = {}) => {
          const appointments = get().appointments;
          return appointments.filter(appointment => {
            const matchesQuery = !query ||
              appointment.patient.toLowerCase().includes(query.toLowerCase()) ||
              appointment.motif.toLowerCase().includes(query.toLowerCase());

            const matchesStatus = !filters.status || filters.status === 'all' || 
              appointment.statut === filters.status;

            const matchesDate = !filters.date || 
              appointment.date === filters.date;

            return matchesQuery && matchesStatus && matchesDate;
          });
        },

        // ========================
        // ACTIONS BATCH
        // ========================
        updateMultipleItems: (type, updates) => {
          switch (type) {
            case 'dispensaires':
              updates.forEach(({ id, data }) => {
                get().updateDispensaire(id, data);
              });
              break;
            case 'users':
              updates.forEach(({ id, data }) => {
                get().updateUser(id, data);
              });
              break;
            case 'appointments':
              updates.forEach(({ id, data }) => {
                get().updateAppointment(id, data);
              });
              break;
          }
        },

        deleteMultipleItems: (type, ids) => {
          switch (type) {
            case 'dispensaires':
              ids.forEach(id => get().removeDispensaire(id));
              break;
            case 'users':
              ids.forEach(id => get().removeUser(id));
              break;
            case 'appointments':
              ids.forEach(id => get().removeAppointment(id));
              break;
          }
        },

        // ========================
        // MÉTHODES UTILITAIRES
        // ========================
        clearAllData: () => set(
          {
            dispensaires: [],
            dispensairesLoaded: false,
            dispensairesLastFetch: null,
            users: [],
            usersLoaded: false,
            usersLastFetch: null,
            appointments: [],
            appointmentsLoaded: false,
            appointmentsLastFetch: null,
            stats: {
              admin: { totalUsers: 0, totalAppointments: 0, totalDispensaries: 0, activeUsers: 0, pendingAppointments: 0, lastUpdated: null },
              doctor: { totalPatients: 0, todayAppointments: 0, weekAppointments: 0, lastUpdated: null },
              global: { totalConsultations: 0, activeDispensaries: 0, lastUpdated: null }
            }
          },
          false,
          'clearAllData'
        ),

        // Calculer les statistiques automatiquement
        calculateStats: () => {
          const state = get();
          
          // Stats admin
          const adminStats = {
            totalUsers: state.users.length,
            totalAppointments: state.appointments.length,
            totalDispensaries: state.dispensaires.length,
            activeUsers: state.users.filter(u => u.status === 'active').length,
            pendingAppointments: state.appointments.filter(a => a.statut === 'En attente').length,
            lastUpdated: Date.now()
          };

          // Stats docteur
          const today = new Date().toISOString().split('T')[0];
          const doctorStats = {
            totalPatients: new Set(state.appointments.map(a => a.patient)).size,
            todayAppointments: state.appointments.filter(a => a.date === today).length,
            weekAppointments: state.appointments.filter(a => {
              const appointmentDate = new Date(a.date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return appointmentDate >= weekAgo;
            }).length,
            lastUpdated: Date.now()
          };

          set(state => ({
            stats: {
              ...state.stats,
              admin: adminStats,
              doctor: doctorStats
            }
          }));
        }
      }),
      {
        name: 'data-cache',
        partialize: (state) => ({
          dispensaires: state.dispensaires,
          dispensairesLoaded: state.dispensairesLoaded,
          dispensairesLastFetch: state.dispensairesLastFetch,
          stats: state.stats
        })
      }
    ),
    {
      name: 'data-store'
    }
  )
);

// ========================
// HOOKS UTILITAIRES
// ========================

// Hook pour les dispensaires
export const useDispensaires = () => {
  const { 
    dispensaires, 
    dispensairesLoaded,
    setDispensaires,
    addDispensaire,
    updateDispensaire,
    removeDispensaire,
    searchDispensaires,
    needsRefresh
  } = useData();

  return {
    dispensaires,
    loaded: dispensairesLoaded,
    needsRefresh: needsRefresh('dispensaires'),
    setDispensaires,
    addDispensaire,
    updateDispensaire,
    removeDispensaire,
    search: searchDispensaires
  };
};

// Hook pour les utilisateurs
export const useUsers = () => {
  const {
    users,
    usersLoaded,
    setUsers,
    addUser,
    updateUser,
    removeUser,
    searchUsers,
    needsRefresh
  } = useData();

  return {
    users,
    loaded: usersLoaded,
    needsRefresh: needsRefresh('users'),
    setUsers,
    addUser,
    updateUser,
    removeUser,
    search: searchUsers
  };
};

// Hook pour les rendez-vous
export const useAppointments = () => {
  const {
    appointments,
    appointmentsLoaded,
    setAppointments,
    addAppointment,
    updateAppointment,
    removeAppointment,
    searchAppointments,
    needsRefresh
  } = useData();

  return {
    appointments,
    loaded: appointmentsLoaded,
    needsRefresh: needsRefresh('appointments'),
    setAppointments,
    addAppointment,
    updateAppointment,
    removeAppointment,
    search: searchAppointments
  };
};

// Hook pour les statistiques
export const useStats = (category = 'admin') => {
  const { getStats, setStats, calculateStats } = useData();

  return {
    stats: getStats(category),
    setStats: (data) => setStats(category, data),
    calculateStats
  };
};

// Support HMR pour Vite
if (import.meta.hot) {
  import.meta.hot.accept();
}
