/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useNotifications, usePreferences } from '../../_store';

/**
 * Centre de notifications global
 * Affiche toutes les notifications toast en temps réel
 */
const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotifications();
  const { notificationPreferences } = usePreferences();

  if (!notificationPreferences.showToasts) {
    return null;
  }

  const visibleNotifications = notifications.slice(0, notificationPreferences.maxVisible);

  return (
    <div className={`fixed z-50 space-y-2 ${getPositionClasses(notificationPreferences.position)}`}>
      {visibleNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
          position={notificationPreferences.position}
          autoClose={notificationPreferences.autoClose}
        />
      ))}
    </div>
  );
};

/**
 * Composant pour une notification individuelle
 */
const NotificationItem = ({ notification, onRemove, position, autoClose }) => {
  const { type, title, message, action, progress } = notification;

  const handleRemove = () => {
    onRemove(notification.id);
  };

  const handleActionClick = () => {
    if (action?.callback) {
      action.callback();
    }
    if (action?.autoClose !== false) {
      handleRemove();
    }
  };

  return (
    <div
      className={`
        min-w-80 max-w-96 p-4 rounded-lg shadow-lg border
        ${getTypeClasses(type)}
        ${notification.persistent ? 'border-l-4' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Icône */}
          <div className="flex-shrink-0 mt-0.5">
            {getTypeIcon(type)}
          </div>
          
          {/* Contenu */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {title}
              </h4>
            )}
            
            <p className="text-sm text-gray-600">
              {message}
            </p>
            
            {/* Barre de progression */}
            {type === 'progress' && typeof progress === 'number' && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress}%</p>
              </div>
            )}
            
            {/* Actions */}
            {action && (
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleActionClick}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {action.label}
                </button>
                {action.cancelLabel && (
                  <button
                    onClick={handleRemove}
                    className="text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {action.cancelLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Bouton fermer */}
        {autoClose && !notification.persistent && (
          <button
            onClick={handleRemove}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// ========================
// UTILITAIRES
// ========================

const getPositionClasses = (position) => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    default:
      return 'top-4 right-4';
  }
};

const getAnimationInitial = (position) => {
  if (position.includes('left')) {
    return { opacity: 0, x: -300, scale: 0.9 };
  }
  return { opacity: 0, x: 300, scale: 0.9 };
};

const getAnimationAnimate = () => ({
  opacity: 1,
  x: 0,
  scale: 1
});

const getAnimationExit = (position) => {
  if (position.includes('left')) {
    return { opacity: 0, x: -300, scale: 0.9 };
  }
  return { opacity: 0, x: 300, scale: 0.9 };
};

const getTypeClasses = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 border-l-green-500';
    case 'error':
      return 'bg-red-50 border-red-200 border-l-red-500';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 border-l-yellow-500';
    case 'info':
      return 'bg-blue-50 border-blue-200 border-l-blue-500';
    case 'loading':
      return 'bg-gray-50 border-gray-200 border-l-gray-500';
    case 'confirm':
      return 'bg-indigo-50 border-indigo-200 border-l-indigo-500';
    case 'progress':
      return 'bg-blue-50 border-blue-200 border-l-blue-500';
    default:
      return 'bg-white border-gray-200';
  }
};

const getTypeIcon = (type) => {
  const iconClasses = "w-5 h-5";
  
  switch (type) {
    case 'success':
      return (
        <svg className={`${iconClasses} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'error':
      return (
        <svg className={`${iconClasses} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={`${iconClasses} text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    case 'info':
      return (
        <svg className={`${iconClasses} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'loading':
      return (
        <div className={`${iconClasses} text-gray-500`}>
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      );
    case 'confirm':
      return (
        <svg className={`${iconClasses} text-indigo-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'progress':
      return (
        <svg className={`${iconClasses} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    default:
      return (
        <svg className={`${iconClasses} text-gray-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export default NotificationCenter;
