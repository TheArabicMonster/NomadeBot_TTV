const fs = require('fs');
const path = require('path');

// Mocker fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

// Mocker path
jest.mock('path', () => ({
  join: jest.fn(() => '/mocked/path/cooldowns.json')
}));

// Mocker config
jest.mock('../../config/config', () => ({
  cooldowns: {
    testCommand: 60000, // 1 minute
    longCommand: 300000 // 5 minutes
  },
  storage: {
    autoSaveInterval: 5000, // 5 secondes pour les tests
    files: {
      cooldowns: 'cooldowns.json'
    }
  }
}));

// Mocker console
const originalConsole = { ...console };
beforeEach(() => {
  console.error = jest.fn();
});
afterEach(() => {
  console.error = originalConsole.error;
});

// Importer après les mocks
const cooldowns = require('../../data/cooldowns');

describe('Gestionnaire de cooldowns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Réinitialiser les données de cooldown
    fs.existsSync.mockReturnValue(false);
    cooldowns.loadCooldowns();
  });

  describe('isOnCooldown', () => {
    test('devrait retourner false si l\'utilisateur n\'a pas de cooldown', () => {
      expect(cooldowns.isOnCooldown('123', 'testCommand')).toBe(false);
    });
    
    test('devrait retourner false si le cooldown est expiré', () => {
      // Configurer un cooldown expiré (il y a 2 minutes)
      const twoMinutesAgo = Date.now() - 120000;
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({
        '123': {
          'testCommand': twoMinutesAgo
        }
      }));
      cooldowns.loadCooldowns();
      
      expect(cooldowns.isOnCooldown('123', 'testCommand')).toBe(false);
    });
    
    test('devrait retourner true si le cooldown est actif', () => {
      // Configurer un cooldown actif (il y a 30 secondes)
      const thirtySecondsAgo = Date.now() - 30000;
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({
        '123': {
          'testCommand': thirtySecondsAgo
        }
      }));
      cooldowns.loadCooldowns();
      
      expect(cooldowns.isOnCooldown('123', 'testCommand')).toBe(true);
    });
  });

  describe('getRemainingTime', () => {
    test('devrait retourner 0 si pas de cooldown', () => {
      expect(cooldowns.getRemainingTime('123', 'testCommand')).toBe(0);
    });
    
    test('devrait retourner le temps restant en minutes', () => {
      // Configurer un cooldown avec 30 secondes écoulées sur 1 minute
      const thirtySecondsAgo = Date.now() - 30000;
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({
        '123': {
          'testCommand': thirtySecondsAgo
        }
      }));
      cooldowns.loadCooldowns();
      
      // Devrait retourner 1 minute (arrondi au supérieur)
      expect(cooldowns.getRemainingTime('123', 'testCommand')).toBe(1);
    });
  });

  describe('setCooldown', () => {
    test('devrait définir un cooldown pour un utilisateur', () => {
      // Espionner Date.now
      const mockNow = 1609459200000; // 2021-01-01T00:00:00.000Z
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);
      
      cooldowns.setCooldown('123', 'testCommand');
      
      expect(cooldowns.isOnCooldown('123', 'testCommand')).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mocked/path/cooldowns.json',
        JSON.stringify({
          '123': {
            'testCommand': mockNow
          }
        }, null, 2)
      );
      
      Date.now.mockRestore();
    });
  });

  describe('setupAutoSave', () => {
    test('devrait configurer la sauvegarde automatique', () => {
      // Espionner setInterval
      jest.useFakeTimers();
      
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      cooldowns.setupAutoSave();
      
      expect(setIntervalSpy).toHaveBeenCalled();
      
      // Simuler l'écoulement du temps
      jest.runOnlyPendingTimers();
      expect(fs.writeFileSync).toHaveBeenCalled();
      
      setIntervalSpy.mockRestore();
      jest.useRealTimers();
    });
  });
});
