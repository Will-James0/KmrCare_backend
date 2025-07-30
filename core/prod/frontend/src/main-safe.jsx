/**
 * Version de test de main.jsx avec gestion d'erreurs
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import sécurisé de l'application
const loadApp = async () => {
  try {
    console.log('🚀 Chargement de l\'application KmrCare...');
    
    // Essayer d'importer l'app principale
    const { default: App } = await import('./App.jsx');
    
    console.log('✅ App.jsx importé avec succès');
    
    // Tester les stores avant de lancer l'app
    console.log('🧪 Test des stores...');
    await import('./_store/index.js');
    console.log('✅ Stores importés avec succès');
    
    return App;
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'application:', error);
    
    // Charger l'app de test en cas d'erreur
    console.log('🔄 Chargement de l\'application de test...');
    const { default: SafeApp } = await import('../SafeApp.jsx');
    return SafeApp;
  }
};

// Fonction de démarrage
const startApp = async () => {
  try {
    const AppComponent = await loadApp();
    
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <AppComponent />
      </StrictMode>
    );
    
    console.log('🎉 Application démarrée avec succès !');
  } catch (error) {
    console.error('💥 Erreur critique lors du démarrage:', error);
    
    // Affichage d'erreur de base
    document.getElementById('root').innerHTML = `
      <div style="
        padding: 20px; 
        text-align: center; 
        font-family: Arial, sans-serif;
        background-color: #fee;
        color: #c00;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      ">
        <h1>❌ Erreur de Démarrage</h1>
        <p>Impossible de démarrer l'application KmrCare.</p>
        <p><strong>Erreur:</strong> ${error.message}</p>
        <button 
          onclick="window.location.reload()" 
          style="
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          "
        >
          🔄 Recharger
        </button>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Consultez la console pour plus de détails.
        </p>
      </div>
    `;
  }
};

// Démarrer l'application
startApp();
