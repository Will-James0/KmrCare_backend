import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Store global pour la gestion des notifications
 * Système centralisé de notifications toast, alertes et messages
 */
export const useNotifications = create()(
  devtools(
    (set, get) => ({
      // ========================
      // ÉTAT DES NOTIFICATIONS
      // ========================
      notifications: [],
      maxNotifications: 5,
      defaultDuration: 5000,

      // ========================
      // ACTIONS PRINCIPALES
      // ========================
      addNotification: (notification) => {
        const id = `notification_${Date.now()}_${Math.random()}`;
        const newNotification = {
          id,
          timestamp: Date.now(),
          duration: notification.duration || get().defaultDuration,
          type: notification.type || 'info',
          title: notification.title || '',
          message: notification.message || '',
          action: notification.action || null,
          persistent: notification.persistent || false,
          ...notification
        };

        set(
          (state) => {
            let notifications = [...state.notifications, newNotification];
            
            // Limiter le nombre de notifications
            if (notifications.length > state.maxNotifications) {
              notifications = notifications.slice(-state.maxNotifications);
            }
            
            return { notifications };
          },
          false,
          'addNotification'
        );

        // Auto-remove si pas persistante
        if (!newNotification.persistent && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }

        return id;
      },

      removeNotification: (id) => set(
        (state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }),
        false,
        'removeNotification'
      ),

      clearAllNotifications: () => set(
        { notifications: [] },
        false,
        'clearAllNotifications'
      ),

      // ========================
      // MÉTHODES DE CONVENANCE
      // ========================
      success: (message, options = {}) => {
        return get().addNotification({
          type: 'success',
          title: options.title || 'Succès',
          message,
          ...options
        });
      },

      error: (message, options = {}) => {
        return get().addNotification({
          type: 'error',
          title: options.title || 'Erreur',
          message,
          duration: options.duration || 8000, // Plus long pour les erreurs
          ...options
        });
      },

      warning: (message, options = {}) => {
        return get().addNotification({
          type: 'warning',
          title: options.title || 'Attention',
          message,
          duration: options.duration || 6000,
          ...options
        });
      },

      info: (message, options = {}) => {
        return get().addNotification({
          type: 'info',
          title: options.title || 'Information',
          message,
          ...options
        });
      },

      // ========================
      // NOTIFICATIONS SPÉCIALISÉES
      // ========================
      
      // Confirmation avec action
      confirm: (message, onConfirm, options = {}) => {
        return get().addNotification({
          type: 'confirm',
          title: options.title || 'Confirmation',
          message,
          persistent: true,
          action: {
            label: options.confirmLabel || 'Confirmer',
            callback: () => {
              onConfirm();
              if (options.autoClose !== false) {
                // Auto-close sera géré par le composant
              }
            },
            cancelLabel: options.cancelLabel || 'Annuler'
          },
          ...options
        });
      },

      // Notification de chargement
      loading: (message, options = {}) => {
        return get().addNotification({
          type: 'loading',
          title: options.title || 'Chargement',
          message,
          persistent: true,
          duration: 0, // Pas d'auto-remove
          ...options
        });
      },

      // Notification de progress
      progress: (message, percentage, options = {}) => {
        return get().addNotification({
          type: 'progress',
          title: options.title || 'Progression',
          message,
          progress: Math.max(0, Math.min(100, percentage)),
          persistent: true,
          duration: 0,
          ...options
        });
      },

      // Mettre à jour une notification existante
      updateNotification: (id, updates) => set(
        (state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === id
              ? { ...notification, ...updates, timestamp: Date.now() }
              : notification
          )
        }),
        false,
        'updateNotification'
      ),

      // ========================
      // GESTION DES GROUPES
      // ========================
      
      // Notifications groupées par type
      getNotificationsByType: (type) => {
        return get().notifications.filter(n => n.type === type);
      },

      // Compter les notifications par type
      getNotificationCount: (type = null) => {
        const notifications = get().notifications;
        return type 
          ? notifications.filter(n => n.type === type).length
          : notifications.length;
      },

      // ========================
      // NOTIFICATIONS API/BACKEND
      // ========================
      
      // Notification de succès API
      apiSuccess: (action, options = {}) => {
        const messages = {
          create: 'Élément créé avec succès',
          update: 'Élément mis à jour avec succès',
          delete: 'Élément supprimé avec succès',
          save: 'Données sauvegardées avec succès',
          send: 'Envoyé avec succès'
        };

        return get().success(
          options.message || messages[action] || 'Opération réussie',
          {
            title: options.title || 'Succès',
            ...options
          }
        );
      },

      // Notification d'erreur API
      apiError: (error, action = '', options = {}) => {
        let message = 'Une erreur est survenue';
        
        if (typeof error === 'string') {
          message = error;
        } else if (error?.response?.data?.message) {
          message = error.response.data.message;
        } else if (error?.message) {
          message = error.message;
        }

        if (action) {
          message = `Erreur lors de ${action}: ${message}`;
        }

        return get().error(message, {
          title: options.title || 'Erreur',
          ...options
        });
      },

      // ========================
      // CONFIGURATIONS
      // ========================
      
      setMaxNotifications: (max) => set(
        { maxNotifications: Math.max(1, max) },
        false,
        'setMaxNotifications'
      ),

      setDefaultDuration: (duration) => set(
        { defaultDuration: Math.max(0, duration) },
        false,
        'setDefaultDuration'
      ),

      // ========================
      // UTILITAIRES
      // ========================
      
      // Vérifier si une notification existe
      hasNotification: (id) => {
        return get().notifications.some(n => n.id === id);
      },

      // Obtenir une notification par ID
      getNotification: (id) => {
        return get().notifications.find(n => n.id === id) || null;
      },

      // Nettoyer les notifications expirées
      cleanupExpired: () => {
        const now = Date.now();
        set(
          (state) => ({
            notifications: state.notifications.filter(notification => {
              if (notification.persistent || notification.duration === 0) {
                return true;
              }
              return (now - notification.timestamp) < notification.duration;
            })
          }),
          false,
          'cleanupExpired'
        );
      }
    }),
    {
      name: 'notifications-store'
    }
  )
);

// ========================
// HOOKS UTILITAIRES
// ========================

// Hook pour l'usage simple des notifications
export const useNotify = () => {
  const { success, error, warning, info, confirm, loading } = useNotifications();
  
  return {
    success,
    error,
    warning,
    info,
    confirm,
    loading
  };
};

// Hook pour les notifications API
export const useApiNotifications = () => {
  const { apiSuccess, apiError } = useNotifications();
  
  return {
    success: apiSuccess,
    error: apiError
  };
};

// Hook pour une notification spécifique
export const useNotification = (id) => {
  const { getNotification, updateNotification, removeNotification } = useNotifications();
  
  return {
    notification: getNotification(id),
    update: (updates) => updateNotification(id, updates),
    remove: () => removeNotification(id)
  };
};

// Support HMR pour Vite
if (import.meta.hot) {
  import.meta.hot.accept();
}
