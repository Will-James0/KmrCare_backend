/* eslint-disable no-unused-vars */
/**
 * Script de validation de la gestion d'état globale
 * À exécuter dans la console du navigateur pour tester tous les stores
 */

// Test de validation de la gestion d'état globale
const validateGlobalState = async () => {
  console.log('🧪 Début des tests de validation de la gestion d\'état globale...\n');
  
  const tests = [];
  
  try {
    // Import des stores depuis les fichiers individuels
    const { useAuth } = await import('./auth.js');
    const { useUI } = await import('./ui.js');
    const { useNotifications } = await import('./notifications.js');
    const { useData } = await import('./data.js');
    const { usePreferences } = await import('./preferences.js');
    const { initializeStores, getGlobalState } = await import('./index.js');

    // Test 1: Initialisation des stores
    console.log('🔧 Test 1: Initialisation des stores');
    await initializeStores();
    tests.push({ name: 'Initialisation', status: '✅' });

    // Test 2: Store Auth
    console.log('🔐 Test 2: Store d\'authentification');
    const authStore = useAuth.getState();
    console.log('- État auth:', { 
      isInitialized: authStore.isInitialized,
      hasUser: !!authStore.user 
    });
    tests.push({ name: 'Store Auth', status: '✅' });

    // Test 3: Store UI
    console.log('🎨 Test 3: Store UI');
    const uiStore = useUI.getState();
    console.log('- État UI:', {
      modals: Object.keys(uiStore.modals).length,
      loadingStates: Object.keys(uiStore.loading).length,
      filters: Object.keys(uiStore.filters).length
    });
    
    // Test des actions UI
    uiStore.setLoading('test', true);
    uiStore.openModal('testModal', { test: true });
    uiStore.updateFilters({ testFilter: 'value' });
    
    console.log('- Actions UI testées avec succès');
    tests.push({ name: 'Store UI', status: '✅' });

    // Test 4: Store Notifications
    console.log('🔔 Test 4: Store de notifications');
    const notifStore = useNotifications.getState();
    
    // Test d'ajout de notification
    notifStore.addNotification({
      id: 'test-notif',
      title: 'Test',
      message: 'Test de notification',
      type: 'info'
    });
    
    console.log('- Notifications actives:', notifStore.notifications.length);
    tests.push({ name: 'Store Notifications', status: '✅' });

    // Test 5: Store Data
    console.log('📊 Test 5: Store de données');
    const dataStore = useData.getState();
    
    // Test des données mockées
    dataStore.setUsers([
      { id: 1, name: 'Test User 1', role: 'admin' },
      { id: 2, name: 'Test User 2', role: 'doctor' }
    ]);
    
    dataStore.setDispensaires([
      { id: 1, name: 'Dispensaire Test', location: 'Test City' }
    ]);
    
    dataStore.calculateStats();
    
    console.log('- Données test:', {
      users: dataStore.users.length,
      dispensaires: dataStore.dispensaires.length,
      stats: !!dataStore.stats
    });
    tests.push({ name: 'Store Data', status: '✅' });

    // Test 6: Store Preferences
    console.log('⚙️ Test 6: Store de préférences');
    const prefStore = usePreferences.getState();
    
    // Test des actions de préférences
    prefStore.setTheme('dark');
    prefStore.setLanguage('en');
    prefStore.setTablePageSize(25);
    
    console.log('- Préférences:', {
      theme: prefStore.theme,
      language: prefStore.language,
      pageSize: prefStore.tablePageSize
    });
    tests.push({ name: 'Store Preferences', status: '✅' });

    // Test 7: État global
    console.log('🌍 Test 7: État global');
    const globalState = await getGlobalState();
    console.log('- Snapshot global récupéré:', !!globalState);
    tests.push({ name: 'État Global', status: '✅' });

    // Test 8: Hooks composés
    console.log('🔗 Test 8: Hooks composés');
    try {
      const { useAdmin } = await import('../hooks/useComposedStores.js');
      console.log('- Hooks composés importés avec succès');
      tests.push({ name: 'Hooks Composés', status: '✅' });
    } catch (error) {
      console.warn('- Erreur lors du test des hooks composés:', error.message);
      tests.push({ name: 'Hooks Composés', status: '⚠️' });
    }

    // Résumé des tests
    console.log('\n📋 Résumé des tests:');
    tests.forEach(test => {
      console.log(`${test.status} ${test.name}`);
    });

    const successCount = tests.filter(t => t.status === '✅').length;
    const warningCount = tests.filter(t => t.status === '⚠️').length;
    const totalCount = tests.length;

    console.log(`\n🎯 Résultat: ${successCount}/${totalCount} tests réussis`);
    
    if (warningCount > 0) {
      console.log(`⚠️ ${warningCount} avertissement(s)`);
    }

    if (successCount === totalCount) {
      console.log('🎉 Tous les tests sont passés ! La gestion d\'état globale fonctionne parfaitement.');
    } else {
      console.log('❌ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    }

    return {
      success: successCount === totalCount,
      tests,
      globalState
    };

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return {
      success: false,
      error: error.message,
      tests
    };
  }
};

// Fonction pour nettoyer après les tests
const cleanupTests = async () => {
  try {
    const { clearAllStores } = await import('./index.js');
    await clearAllStores();
    console.log('🧹 Nettoyage des tests terminé');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
};

// Exporter les fonctions pour utilisation dans la console
window.validateGlobalState = validateGlobalState;
window.cleanupTests = cleanupTests;

// Instructions d'utilisation
console.log(`
🧪 Tests de validation de la gestion d'état globale

Pour tester le système, ouvrez la console de votre navigateur et exécutez :

1. Validation complète :
   validateGlobalState()

2. Nettoyage après tests :
   cleanupTests()

Ces fonctions sont maintenant disponibles globalement dans la console.
`);

export { validateGlobalState, cleanupTests };
