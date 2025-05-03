/**
 * Configuration pour les tests de bout en bout
 * 
 * Ce script permet de configurer un environnement complet pour tester le bot
 * avec un client Twitch mock mais en utilisant le vrai code sans mocks pour
 * l'ensemble des autres fonctionnalités.
 */
const path = require('path');
const fs = require('fs');

// Créer des fichiers temporaires pour les tests
const TEST_DATA_DIR = path.join(__dirname, 'test_data');
const TEST_INVENTORY_FILE = path.join(TEST_DATA_DIR, 'inventory_test.json');
const TEST_COOLDOWNS_FILE = path.join(TEST_DATA_DIR, 'cooldowns_test.json');
const TEST_USERS_FILE = path.join(TEST_DATA_DIR, 'users_test.json');

// Fonction pour initialiser l'environnement de test
function setupTestEnvironment() {
  console.log('🔧 Initialisation de l\'environnement de test...');
  
  // Créer le répertoire de test s'il n'existe pas
  if (!fs.existsSync(TEST_DATA_DIR)) {
    fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
    console.log(`✅ Répertoire créé: ${TEST_DATA_DIR}`);
  }
  
  // Créer des fichiers vides pour les tests
  fs.writeFileSync(TEST_INVENTORY_FILE, '{}');
  fs.writeFileSync(TEST_COOLDOWNS_FILE, '{}');
  fs.writeFileSync(TEST_USERS_FILE, '{}');
  console.log('✅ Fichiers de test créés');
  
  // Configurer les variables d'environnement pour les tests
  process.env.NODE_ENV = 'test';
  process.env.TEST_INVENTORY_PATH = TEST_INVENTORY_FILE;
  process.env.TEST_COOLDOWNS_PATH = TEST_COOLDOWNS_FILE;
  process.env.TEST_USERS_PATH = TEST_USERS_FILE;
  
  console.log('✅ Variables d\'environnement configurées');
}

// Fonction pour nettoyer l'environnement de test
function cleanupTestEnvironment() {
  console.log('🧹 Nettoyage de l\'environnement de test...');
  
  // Supprimer les fichiers de test
  if (fs.existsSync(TEST_INVENTORY_FILE)) {
    fs.unlinkSync(TEST_INVENTORY_FILE);
  }
  
  if (fs.existsSync(TEST_COOLDOWNS_FILE)) {
    fs.unlinkSync(TEST_COOLDOWNS_FILE);
  }
  
  if (fs.existsSync(TEST_USERS_FILE)) {
    fs.unlinkSync(TEST_USERS_FILE);
  }
  
  console.log('✅ Fichiers de test supprimés');
}

module.exports = {
  setupTestEnvironment,
  cleanupTestEnvironment,
  TEST_DATA_DIR,
  TEST_INVENTORY_FILE,
  TEST_COOLDOWNS_FILE,
  TEST_USERS_FILE
};

// Si ce script est exécuté directement
if (require.main === module) {
  if (process.argv[2] === 'setup') {
    setupTestEnvironment();
  } else if (process.argv[2] === 'cleanup') {
    cleanupTestEnvironment();
  } else {
    console.log('Usage: node setup.js [setup|cleanup]');
  }
}
