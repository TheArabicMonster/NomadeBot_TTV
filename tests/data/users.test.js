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
  join: jest.fn(() => '/mocked/path/user_map.json')
}));

// Mocker console pour les messages de log
const originalConsole = { ...console };
beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});
afterEach(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
});

// Importer après les mocks
const users = require('../../data/users');

describe('Gestionnaire d\'utilisateurs', () => {
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  describe('loadUserMapping', () => {
    test('devrait charger le mapping d\'utilisateurs depuis le fichier', () => {
      // Configurer les mocks
      const mockData = '{"123": "testuser", "456": "otheruser"}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockData);
      
      // Appeler la fonction
      const result = users.loadUserMapping();
      
      // Vérifications
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalledWith('/mocked/path/user_map.json', 'utf8');
      expect(result).toEqual({"123": "testuser", "456": "otheruser"});
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/✅.*2 utilisateurs/));
    });
    
    test('devrait créer un mapping vide si le fichier n\'existe pas', () => {
      fs.existsSync.mockReturnValue(false);
      
      const result = users.loadUserMapping();
      
      expect(fs.readFileSync).not.toHaveBeenCalled();
      expect(result).toEqual({});
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/⚠️.*nouveau/));
    });
    
    test('devrait gérer les erreurs de lecture', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => { throw new Error('Test error'); });
      
      const result = users.loadUserMapping();
      
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/❌.*erreur/), expect.any(Error));
      expect(result).toEqual({});
    });
  });

  describe('saveUserMapping', () => {
    test('devrait sauvegarder le mapping d\'utilisateurs dans le fichier', () => {
      // Appeler loadUserMapping pour initialiser l'état
      const mockData = '{"123": "testuser", "456": "otheruser"}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockData);
      users.loadUserMapping();
      
      // Reset les mocks pour le test
      jest.clearAllMocks();
      
      // Appeler saveUserMapping
      users.saveUserMapping();
      
      // Vérifications
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mocked/path/user_map.json', 
        expect.any(String)
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/✅.*sauvegardé/));
    });
    
    test('devrait gérer les erreurs d\'écriture', () => {
      fs.writeFileSync.mockImplementation(() => { throw new Error('Test write error'); });
      
      users.saveUserMapping();
      
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/❌.*erreur/), expect.any(Error));
    });
  });

  describe('recordUser', () => {
    test('devrait enregistrer un utilisateur', () => {
      // Initialiser avec un mapping vide
      fs.existsSync.mockReturnValue(false);
      users.loadUserMapping();
      
      const result = users.recordUser('testuser', '123');
      
      expect(result).toBe(true);
      expect(users.getUsernameById('123')).toBe('testuser');
    });
    
    test('devrait mettre à jour un utilisateur existant', () => {
      // Initialiser avec un mapping existant
      const mockData = '{"123": "oldusername"}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockData);
      users.loadUserMapping();
      
      const result = users.recordUser('newusername', '123');
      
      expect(result).toBe(true);
      expect(users.getUsernameById('123')).toBe('newusername');
    });
    
    test('devrait retourner false pour des valeurs invalides', () => {
      expect(users.recordUser(null, '123')).toBe(false);
      expect(users.recordUser('testuser', null)).toBe(false);
    });
  });

  describe('getUsernameById', () => {
    test('devrait retourner le nom d\'utilisateur pour un ID connu', () => {
      // Initialiser avec un mapping existant
      const mockData = '{"123": "testuser"}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockData);
      users.loadUserMapping();
      
      expect(users.getUsernameById('123')).toBe('testuser');
    });
    
    test('devrait retourner un nom généré pour un ID inconnu', () => {
      // Initialiser avec un mapping existant
      const mockData = '{"123": "testuser"}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockData);
      users.loadUserMapping();
      
      const result = users.getUsernameById('456');
      expect(result).toMatch(/User-\d{4}/);
    });
  });

  describe('setupAutoSave', () => {
    test('devrait configurer un intervalle pour la sauvegarde automatique', () => {
      jest.useFakeTimers();
      
      // Espionner setInterval
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      
      users.setupAutoSave();
      
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/⏱️.*configurée/));
      
      // Simuler l'intervalle
      jest.runOnlyPendingTimers();
      expect(fs.writeFileSync).toHaveBeenCalled();
      
      jest.useRealTimers();
      setIntervalSpy.mockRestore();
    });
  });
});
