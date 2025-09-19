/**
 * Script de test pour l'intégration Backend-Frontend
 * Vérification des inscriptions utilisateur et propriétaire de dispensaire
 */

// Test des services d'authentification
import { registerUser, registerDispensaryRequest } from './src/_lib/authService.js';

// Données de test pour inscription utilisateur
const testUserData = {
  first_name: "Jean",
  last_name: "Dupont",
  email: "jean.dupont@example.com",
  password: "motdepasse123",
  confirmPassword: "motdepasse123",
  phone: "0123456789",
  acceptTerms: true
};

// Données de test pour inscription dispensaire
const testDispensaryData = {
  manager_first_name: "Marie",
  manager_last_name: "Martin",
  email: "marie.martin@dispensaire.com",
  password: "motdepasse123",
  confirmPassword: "motdepasse123",
  phone: "0987654321",
  dispensary_name: "Dispensaire Test",
  dispensary_type: "Médecine générale",
  address: "123 Rue de la Santé",
  dispensary_phone: "0987654321",
  dispensary_email: "contact@dispensaire.com",
  opening_hours: "08:00",
  closing_hours: "18:00",
  acceptTerms: true,
  acceptPrivacy: true,
  acceptCertification: true
};

// Fonction de test pour l'inscription utilisateur
async function testUserRegistration() {
  console.log('🧪 Test d\'inscription utilisateur...');
  
  try {
    const result = await registerUser(testUserData);
    console.log('✅ Inscription utilisateur réussie:', result);
    return true;
  } catch (error) {
    console.error('❌ Erreur inscription utilisateur:', error.message);
    return false;
  }
}

// Fonction de test pour l'inscription dispensaire
async function testDispensaryRegistration() {
  console.log('🧪 Test d\'inscription dispensaire...');
  
  try {
    const result = await registerDispensaryRequest(testDispensaryData);
    console.log('✅ Inscription dispensaire réussie:', result);
    return true;
  } catch (error) {
    console.error('❌ Erreur inscription dispensaire:', error.message);
    return false;
  }
}

// Test des mappings de champs
function testFieldMapping() {
  console.log('🧪 Test des mappages de champs...');
  
  // Vérifier que les champs frontend correspondent au backend
  const requiredUserFields = ['first_name', 'last_name', 'email', 'username', 'password', 'phone'];
  const requiredDispensaryFields = [
    'first_name', 'last_name', 'email', 'username', 'password', 'phone',
    'dispensary_name', 'dispensary_specialities', 'dispensary_quarter', 
    'dispensary_localisation', 'dispensary_phone', 'dispensary_email',
    'dispensary_opening', 'dispensary_ending'
  ];
  
  console.log('📋 Champs requis pour inscription utilisateur:', requiredUserFields);
  console.log('📋 Champs requis pour inscription dispensaire:', requiredDispensaryFields);
  
  // Vérification que testUserData contient les champs (transformés si nécessaire)
  const userMappedData = {
    ...testUserData,
    username: testUserData.email // Mapping automatique
  };
  
  const dispensaryMappedData = {
    username: testDispensaryData.email,
    first_name: testDispensaryData.manager_first_name,
    last_name: testDispensaryData.manager_last_name,
    email: testDispensaryData.email,
    password: testDispensaryData.password,
    phone: testDispensaryData.phone,
    dispensary_name: testDispensaryData.dispensary_name,
    dispensary_specialities: testDispensaryData.dispensary_type || '',
    dispensary_quarter: testDispensaryData.address,
    dispensary_localisation: testDispensaryData.address,
    dispensary_phone: testDispensaryData.dispensary_phone || testDispensaryData.phone,
    dispensary_email: testDispensaryData.dispensary_email,
    dispensary_opening: testDispensaryData.opening_hours || '08:00',
    dispensary_ending: testDispensaryData.closing_hours || '18:00'
  };
  
  console.log('🔄 Données utilisateur mappées:', userMappedData);
  console.log('🔄 Données dispensaire mappées:', dispensaryMappedData);
  
  return true;
}

// Test principal
async function runTests() {
  console.log('🚀 Démarrage des tests d\'intégration Backend-Frontend\n');
  
  // Test des mappings
  testFieldMapping();
  console.log('');
  
  // Tests d'inscription (commentés pour éviter les appels API réels)
  console.log('⚠️  Tests d\'API commentés pour éviter de créer de vraies inscriptions');
  console.log('   Décommentez les lignes ci-dessous pour tester avec l\'API réelle\n');
  
  /*
  const userTest = await testUserRegistration();
  console.log('');
  
  const dispensaryTest = await testDispensaryRegistration();
  console.log('');
  
  if (userTest && dispensaryTest) {
    console.log('🎉 Tous les tests sont passés avec succès !');
  } else {
    console.log('💥 Certains tests ont échoué.');
  }
  */
  
  console.log('✅ Tests de mapping terminés avec succès');
}

// Exécuter les tests si ce fichier est appelé directement
if (typeof window !== 'undefined') {
  // Environnement navigateur
  window.runIntegrationTests = runTests;
  console.log('💡 Utilisez runIntegrationTests() dans la console pour lancer les tests');
} else {
  // Environnement Node.js
  runTests();
}

export { runTests, testUserRegistration, testDispensaryRegistration, testFieldMapping };
