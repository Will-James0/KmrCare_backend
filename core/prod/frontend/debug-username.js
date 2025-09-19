/**
 * Test spécifique pour vérifier l'inscription patient avec username
 */

// Simulation exacte de ce qui se passe dans authService.js
function simulateRegisterUser(userData) {
  console.log('🧪 SIMULATION registerUser()');
  console.log('==============================');
  
  // Étape 1: Données d'entrée
  console.log('1. Données d\'entrée:', userData);
  
  // Étape 2: Suppression des champs de confirmation
  const { confirmPassword, acceptTerms, ...dataToSend } = userData;
  console.log('2. Après suppression confirmPassword et acceptTerms:', dataToSend);
  
  // Étape 3: Ajout du username si absent
  if (!dataToSend.username) {
    dataToSend.username = userData.email;
    console.log('3. Username ajouté depuis email:', dataToSend.username);
  } else {
    console.log('3. Username déjà présent:', dataToSend.username);
  }
  
  console.log('4. Données finales envoyées à l\'API:', dataToSend);
  
  return dataToSend;
}

// Simulation exacte de ce qui se passe dans api.js
function simulateAPIRegisterUser(userData) {
  console.log('\n🌐 SIMULATION API registerUser()');
  console.log('===================================');
  
  console.log('1. Données reçues par l\'API:', userData);
  
  // Double vérification du username
  const dataToSend = {
    ...userData,
    username: userData.username || userData.email
  };
  
  console.log('2. Données après double vérification:', dataToSend);
  
  return dataToSend;
}

// Test avec données patient typiques
const testUserData = {
  first_name: "Jean",
  last_name: "Dupont",
  email: "jean.dupont@test.com",
  password: "password123",
  confirmPassword: "password123",
  phone: "0123456789",
  acceptTerms: true
};

console.log('🚀 TEST COMPLET INSCRIPTION PATIENT\n');

// Simulation du flux complet
const step1 = simulateRegisterUser(testUserData);
const step2 = simulateAPIRegisterUser(step1);

console.log('\n✅ VÉRIFICATION FINALE');
console.log('======================');

const requiredFields = ["first_name", "last_name", "email", "username", "password", "phone"];
let allFieldsPresent = true;

requiredFields.forEach(field => {
  if (field in step2) {
    console.log(`✅ ${field}: ${step2[field]}`);
  } else {
    console.log(`❌ MANQUANT: ${field}`);
    allFieldsPresent = false;
  }
});

console.log(`\n📊 RÉSULTAT: ${allFieldsPresent ? '✅ TOUS CHAMPS PRÉSENTS' : '❌ CHAMPS MANQUANTS'}`);

// Test avec un userData qui a déjà un username
console.log('\n🧪 TEST AVEC USERNAME EXISTANT');
console.log('===============================');

const testWithUsername = {
  ...testUserData,
  username: "jeandupont"
};

const stepA = simulateRegisterUser(testWithUsername);
const stepB = simulateAPIRegisterUser(stepA);

console.log('Username final:', stepB.username);
console.log(stepB.username === "jeandupont" ? '✅ Username personnalisé préservé' : '❌ Username écrasé par email');
