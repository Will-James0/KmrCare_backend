/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/**
 * Error Boundary global pour capturer et gérer les erreurs React
 * Intégré au système de notifications globales
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour le state pour afficher l'UI d'erreur
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur
    console.error('🚨 ErrorBoundary a capturé une erreur:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Essayer d'envoyer la notification d'erreur via le callback
    if (this.props.onError) {
      this.props.onError({
        title: 'Erreur applicative',
        message: `Une erreur inattendue s'est produite: ${error.message}`,
        type: 'error',
        duration: 8000,
        actions: [
          {
            label: 'Recharger la page',
            action: () => window.location.reload()
          }
        ]
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Interface utilisateur de fallback personnalisée
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Oups ! Une erreur s`est produite
              </h2>
              
              <p className="text-gray-600 mb-6">
                Nous sommes désolés, mais quelque chose s`est mal passé. 
                L`équipe technique a été notifiée.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Recharger la page
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Retour à la page précédente
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Détails techniques (développement)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                    <div className="text-red-600 font-semibold mb-2">Erreur:</div>
                    <div className="mb-3">{this.state.error && this.state.error.toString()}</div>
                    
                    <div className="text-red-600 font-semibold mb-2">Stack trace:</div>
                    <div className="whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC pour faciliter l'utilisation avec les hooks
const ErrorBoundaryWrapper = ({ children }) => {
  // Gestion des erreurs sans hooks dans la class component
  const handleError = (errorDetails) => {
    try {
      // Import dynamique pour éviter les problèmes de hooks
      import('../_store').then(({ useNotifications }) => {
        const notifStore = useNotifications.getState();
        notifStore.addNotification(errorDetails);
      }).catch(() => {
        // Si l'import échoue, utiliser console.error
        console.error('Impossible d\'afficher la notification d\'erreur:', errorDetails);
      });
    } catch (error) {
      console.error('Erreur lors de la gestion d\'erreur:', error);
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
export { ErrorBoundary };
