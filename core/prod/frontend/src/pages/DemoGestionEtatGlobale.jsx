/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'motion/react';
import { useNotify, useTheme, useUI } from '../_store';

/**
 * Page de démonstration de la gestion d'état globale
 * Accessible via /demo pour tester les fonctionnalités
 */
const DemoGestionEtatGlobale = () => {
  const notify = useNotify();
  const { theme, setTheme, isDark } = useTheme();
  const { toggleSidebar, isSidebarOpen } = useUI();

  const handleTestNotifications = () => {
    // Test séquentiel des différents types de notifications
    setTimeout(() => notify.success('Notification de succès !'), 100);
    setTimeout(() => notify.error('Une erreur est survenue'), 600);
    setTimeout(() => notify.warning('Attention à ceci'), 1100);
    setTimeout(() => notify.info('Information importante'), 1600);
    
    // Test notification avec action
    setTimeout(() => {
      notify.confirm(
        'Voulez-vous continuer cette action ?',
        () => notify.success('Action confirmée !'),
        {
          title: 'Confirmation requise',
          confirmLabel: 'Oui, continuer',
          cancelLabel: 'Annuler'
        }
      );
    }, 2100);
  };

  const handleTestProgress = () => {
    let progress = 0;
    const progressId = notify.progress('Téléchargement en cours...', 0);
    
    const interval = setInterval(() => {
      progress += 10;
      
      if (progress <= 100) {
        notify.updateNotification(progressId, {
          progress,
          message: `Téléchargement en cours... ${progress}%`
        });
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          notify.removeNotification(progressId);
          notify.success('Téléchargement terminé !');
        }, 500);
      }
    }, 200);
  };

  const handleTestTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    notify.info(`Thème changé vers: ${newTheme}`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            🎯 Démonstration - Gestion d`État Globale
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Testez les fonctionnalités des stores globaux KmrCare
          </p>
        </motion.div>

        {/* Status Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-lg mb-8 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
        >
          <h2 className="text-xl font-semibold mb-4">📊 État Actuel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h3 className="font-medium mb-2">🎨 Thème</h3>
              <p>{theme} {isDark ? '🌙' : '☀️'}</p>
            </div>
            <div className={`p-4 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h3 className="font-medium mb-2">📱 Sidebar</h3>
              <p>{isSidebarOpen ? 'Ouverte' : 'Fermée'}</p>
            </div>
            <div className={`p-4 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h3 className="font-medium mb-2">🔔 Notifications</h3>
              <p>Centre actif</p>
            </div>
          </div>
        </motion.div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Notifications Tests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-lg ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}
          >
            <h3 className="text-lg font-semibold mb-4">🔔 Notifications</h3>
            <div className="space-y-3">
              <button
                onClick={handleTestNotifications}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Tester Types de Notifications
              </button>
              <button
                onClick={handleTestProgress}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                Tester Barre de Progression
              </button>
              <button
                onClick={() => notify.loading('Chargement...', { persistent: true })}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Notification de Chargement
              </button>
            </div>
          </motion.div>

          {/* UI State Tests */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-lg ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}
          >
            <h3 className="text-lg font-semibold mb-4">🎨 Interface</h3>
            <div className="space-y-3">
              <button
                onClick={handleTestTheme}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                Basculer Thème ({isDark ? 'Vers Clair' : 'Vers Sombre'})
              </button>
              <button
                onClick={toggleSidebar}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
              >
                Toggle Sidebar ({isSidebarOpen ? 'Fermer' : 'Ouvrir'})
              </button>
              <button
                onClick={() => notify.info('Préférences UI mises à jour')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors"
              >
                Tester Préférences
              </button>
            </div>
          </motion.div>

          {/* Store Tests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-lg ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}
          >
            <h3 className="text-lg font-semibold mb-4">💾 Stores</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Simuler une action de données
                  notify.loading('Chargement des données...');
                  setTimeout(() => {
                    notify.removeAllNotifications();
                    notify.success('Données chargées avec succès!');
                  }, 2000);
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition-colors"
              >
                Simuler Chargement Données
              </button>
              <button
                onClick={() => {
                  notify.error('Erreur de connexion API', {
                    title: 'Erreur Réseau',
                    duration: 8000
                  });
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Simuler Erreur API
              </button>
              <button
                onClick={() => {
                  notify.success('Cache invalidé et données rafraîchies');
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
              >
                Tester Cache
              </button>
            </div>
          </motion.div>
        </div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-8 p-6 rounded-lg ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
          } border`}
        >
          <h3 className="text-lg font-semibold mb-3">ℹ️ Informations</h3>
          <ul className={`space-y-2 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <li>• Notifications apparaissent en haut à droite avec animations</li>
            <li>• Le thème est persisté dans le localStorage</li>
            <li>• Les stores sont connectés aux DevTools pour debugging</li>
            <li>• Tous les états sont centralisés et réactifs</li>
            <li>• Support complet des erreurs API et gestion automatique</li>
          </ul>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ← Retour à l`accueil
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoGestionEtatGlobale;
