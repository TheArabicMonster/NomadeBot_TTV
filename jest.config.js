/**
 * Configuration Jest pour NomadeBot_TTV
 */
module.exports = {
  // Environnement d'exécution des tests
  testEnvironment: 'node',
  
  // Patterns pour trouver les fichiers de test
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  
  // Exclure node_modules et autres dossiers non pertinents
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Timeout des tests (par défaut: 5 secondes, on augmente à 10 secondes)
  testTimeout: 10000,
  
  // Activer l'allocation mémoire pour éviter les erreurs de mémoire
  maxWorkers: '50%',
  
  // Fichier de setup global
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Mock automatique des modules (utile pour les tests)
  automock: false,
  
  // Indiquer à Jest de ne pas utiliser les mocks de watchman
  watchman: false,
  
  // Variables d'environnement spécifiques pour les tests
  testEnvironmentOptions: {
    env: {
      NODE_ENV: 'test'
    }
  },
  
  // Configuration du rapport de couverture
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  
  // Seuils minimaux de couverture (désactivés pour l'instant)
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0
    }
  }
};
