import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Service de notification pour les messages de permission et d'erreur
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showError = useCallback((message) => {
    return addNotification(message, 'error');
  }, [addNotification]);

  const showSuccess = useCallback((message) => {
    return addNotification(message, 'success');
  }, [addNotification]);

  const showWarning = useCallback((message) => {
    return addNotification(message, 'warning');
  }, [addNotification]);

  const showInfo = useCallback((message) => {
    return addNotification(message, 'info');
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo
  };
};

/**
 * Composant d'affichage des notifications
 */
export const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  const getNotificationStyles = (type) => {
    const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 flex items-start space-x-3 mb-3 transition-all duration-300";
    
    switch (type) {
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getNotificationStyles(notification.type)}
        >
          <span className="text-xl">{getIcon(notification.type)}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

NotificationContainer.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['error', 'success', 'warning', 'info']).isRequired
  })).isRequired,
  onRemove: PropTypes.func.isRequired
};

/**
 * Modal de confirmation pour les actions sensibles
 */
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case 'danger':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info':
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border-2 ${getModalStyles()}`}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info'])
};

export default {
  useNotification,
  NotificationContainer,
  ConfirmationModal
};
