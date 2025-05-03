/**
 * Configuration générale pour les tests Jest
 * Ce fichier est exécuté avant chaque suite de tests
 */

// Augmenter le timeout des tests
jest.setTimeout(10000);

// Éviter de spammer la console avec les logs pendant les tests
// Enlever ces lignes si vous avez besoin de voir les logs
beforeAll(() => {
  // Sauvegarder les fonctions originales
  global._consolelog = console.log;
  global._consoleerror = console.error;
  global._consolewarn = console.warn;
  
  // Remplacer par des fonctions muettes pendant les tests
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

// Restaurer les fonctions console après tous les tests
afterAll(() => {
  console.log = global._consolelog;
  console.error = global._consoleerror;
  console.warn = global._consolewarn;
});

// Fonction d'aide pour mocker dotenv
function mockDotEnv() {
  // Configuration environnement de test
  process.env.NODE_ENV = 'test';
  process.env.TWITCH_BOT_USERNAME = 'test_bot';
  process.env.TWITCH_TOKEN = 'oauth:test_token';
  process.env.TWITCH_CHANNEL = 'test_channel';
}

// Nettoyer les mocks après chaque test
afterEach(() => {
  jest.clearAllMocks();
});

module.exports = {
  mockDotEnv
};
