/* eslint-disable no-unused-vars */
/**
 * Page de configuration et préférences utilisateur
 * Démontre l'utilisation complète de la gestion d'état globale
 */

import React, { useState } from 'react';
import {
  usePreferences,
  useTheme,
  useNotify,
  useUI,
  useData,
  getGlobalState,
  clearAllStores,
  UI_THEMES,
  NOTIFICATION_TYPES
} from '../_store';

const UserPreferences = () => {
  const [activeTab, setActiveTab] = useState('theme');
  const [debugInfo, setDebugInfo] = useState(null);

  // Hooks pour les différents stores
  const { 
    theme, 
    setTheme, 
    tablePageSize, 
    setTablePageSize,
    language,
    setLanguage,
    notifications: notifPrefs,
    setNotificationPreference
  } = usePreferences();
  
  const { toggleTheme } = useTheme();
  const notify = useNotify();
  const { setLoading } = useUI();
  const { calculateStats } = useData();

  // Fonctions de test pour les notifications
  const testNotifications = () => {
    notify({
      title: 'Test réussi !',
      message: 'Le système de notifications fonctionne parfaitement.',
      type: NOTIFICATION_TYPES.SUCCESS,
      duration: 3000
    });

    setTimeout(() => {
      notify({
        title: 'Notification d\'information',
        message: 'Voici une notification informative avec une icône personnalisée.',
        type: NOTIFICATION_TYPES.INFO,
        duration: 4000,
        icon: '📋'
      });
    }, 1000);

    setTimeout(() => {
      notify({
        title: 'Confirmation requise',
        message: 'Voulez-vous vraiment supprimer cet élément ?',
        type: NOTIFICATION_TYPES.CONFIRM,
        duration: 0, // Persistante
        actions: [
          {
            label: 'Confirmer',
            action: () => notify({
              title: 'Suppression confirmée',
              message: 'L\'élément a été supprimé avec succès.',
              type: NOTIFICATION_TYPES.SUCCESS
            })
          },
          {
            label: 'Annuler',
            action: () => notify({
              title: 'Suppression annulée',
              message: 'Aucune modification n\'a été effectuée.',
              type: NOTIFICATION_TYPES.INFO
            })
          }
        ]
      });
    }, 2000);
  };

  const testLoadingStates = async () => {
    setLoading('global', true);
    notify({
      title: 'Chargement en cours...',
      message: 'Test du système de loading global',
      type: NOTIFICATION_TYPES.LOADING,
      duration: 3000
    });

    setTimeout(() => {
      setLoading('global', false);
      notify({
        title: 'Chargement terminé !',
        message: 'Le test de loading s\'est bien déroulé.',
        type: NOTIFICATION_TYPES.SUCCESS
      });
    }, 3000);
  };

  const showGlobalState = async () => {
    const state = await getGlobalState();
    setDebugInfo(state);
    notify({
      title: 'État global récupéré',
      message: 'Consultez la console pour voir les détails.',
      type: NOTIFICATION_TYPES.INFO
    });
    console.log('🏪 État global complet:', state);
  };

  const resetAllStores = async () => {
    await clearAllStores();
    notify({
      title: 'Stores réinitialisés',
      message: 'Tous les stores ont été nettoyés avec succès.',
      type: NOTIFICATION_TYPES.SUCCESS
    });
  };

  const tabs = [
    { id: 'theme', label: '🎨 Thème', icon: '🎨' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'table', label: '📊 Tableaux', icon: '📊' },
    { id: 'language', label: '🌍 Langue', icon: '🌍' },
    { id: 'debug', label: '🐛 Debug', icon: '🐛' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ⚙️ Configuration & Préférences
          </h1>
          <p className="text-gray-600">
            Gérez vos préférences et testez le système de gestion d`état globale.
          </p>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Thème */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Apparence</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(UI_THEMES).map((themeOption) => (
                    <div
                      key={themeOption}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        theme === themeOption
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setTheme(themeOption)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {themeOption === 'light' && '☀️'}
                          {themeOption === 'dark' && '🌙'}
                          {themeOption === 'auto' && '🌓'}
                        </div>
                        <div className="font-medium capitalize">{themeOption}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {themeOption === 'light' && 'Thème clair'}
                          {themeOption === 'dark' && 'Thème sombre'}
                          {themeOption === 'auto' && 'Auto (système)'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    🔄 Basculer le thème
                  </button>
                </div>
              </div>
            )}

            {/* Onglet Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifPrefs).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium capitalize">{type}</div>
                        <div className="text-sm text-gray-500">
                          Notifications de type {type}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setNotificationPreference(type, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Tests des notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={testNotifications}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      🧪 Tester les notifications
                    </button>
                    <button
                      onClick={testLoadingStates}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      ⏳ Tester le loading
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Tableaux */}
            {activeTab === 'table' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Préférences des tableaux</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d`éléments par page
                    </label>
                    <select
                      value={tablePageSize}
                      onChange={(e) => setTablePageSize(Number(e.target.value))}
                      className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={5}>5 éléments</option>
                      <option value={10}>10 éléments</option>
                      <option value={20}>20 éléments</option>
                      <option value={50}>50 éléments</option>
                      <option value={100}>100 éléments</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Langue */}
            {activeTab === 'language' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Langue de l`interface</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { code: 'fr', name: 'Français', flag: '🇫🇷' },
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'es', name: 'Español', flag: '🇪🇸' },
                    { code: 'ar', name: 'العربية', flag: '🇲🇦' }
                  ].map((lang) => (
                    <div
                      key={lang.code}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        language === lang.code
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setLanguage(lang.code)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <div className="font-medium">{lang.name}</div>
                          <div className="text-sm text-gray-500">{lang.code.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Debug */}
            {activeTab === 'debug' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Outils de développement</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={showGlobalState}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    📊 Voir l`état global
                  </button>
                  <button
                    onClick={calculateStats}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    📈 Recalculer les stats
                  </button>
                  <button
                    onClick={resetAllStores}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    🗑️ Réinitialiser les stores
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    🔄 Recharger la page
                  </button>
                </div>

                {debugInfo && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">État global actuel</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
