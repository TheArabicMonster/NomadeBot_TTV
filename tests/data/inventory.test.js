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
  join: jest.fn(() => '/mocked/path/inventaires.json')
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

// Importer après les mocks pour que les mocks soient appliqués
const inventory = require('../../data/inventory');

describe('Gestionnaire d\'inventaire', () => {
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  describe('loadInventories', () => {
    test('devrait charger les inventaires depuis le fichier', () => {
      // Configurer les mocks
      const mockData = '{"123": [{"name": "Test Skin", "rarity": "mil-spec", "color": "#123456"}]}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockData);
      
      // Appeler la fonction
      const result = inventory.loadInventories();
      
      // Vérifications
      expect(fs.existsSync).toHaveBeenCalledWith('/mocked/path/inventaires.json');
      expect(fs.readFileSync).toHaveBeenCalledWith('/mocked/path/inventaires.json', 'utf8');
      expect(result).toEqual({"123": [{"name": "Test Skin", "rarity": "mil-spec", "color": "#123456"}]});
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/✅.*1 inventaires/));
    });
    
    test('devrait créer un inventaire vide si le fichier n\'existe pas', () => {
      fs.existsSync.mockReturnValue(false);
      
      const result = inventory.loadInventories();
      
      expect(fs.readFileSync).not.toHaveBeenCalled();
      expect(result).toEqual({});
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/⚠️.*nouveau/));
    });
    
    test('devrait gérer les erreurs de lecture', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => { throw new Error('Test error'); });
      
      const result = inventory.loadInventories();
      
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/❌.*erreur/), expect.any(Error));
      expect(result).toEqual({});
    });
  });

  describe('saveInventories', () => {
    test('devrait sauvegarder les inventaires dans le fichier', () => {
      // Appeler loadInventories pour initialiser l'état
      const mockData = '{"123": [{"name": "Test Skin", "rarity": "mil-spec", "color": "#123456"}]}';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockData);
      inventory.loadInventories();
      
      // Reset les mocks pour le test
      jest.clearAllMocks();
      
      // Appeler saveInventories
      inventory.saveInventories();
      
      // Vérifications
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mocked/path/inventaires.json', 
        expect.any(String)
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/✅.*sauvegardés/));
    });
    
    test('devrait gérer les erreurs d\'écriture', () => {
      fs.writeFileSync.mockImplementation(() => { throw new Error('Test write error'); });
      
      inventory.saveInventories();
      
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/❌.*erreur/), expect.any(Error));
    });
  });

  describe('addSkinToInventory', () => {
    test('devrait ajouter un skin à l\'inventaire d\'un utilisateur', () => {
      // Initialiser avec un inventaire vide
      fs.existsSync.mockReturnValue(false);
      inventory.loadInventories();
      
      const userId = '123';
      const skin = {
        name: "Test Skin",
        rarity: "mil-spec",
        color: "#123456",
        obtainedAt: "2023-01-01T00:00:00.000Z"
      };
      
      const result = inventory.addSkinToInventory(userId, skin);
      
      expect(result).toBe(true);
      
      // Vérifier que l'inventaire a bien été mis à jour
      const userInventory = inventory.getUserInventory(userId);
      expect(userInventory).toHaveLength(1);
      expect(userInventory[0]).toEqual(skin);
    });
  });

  // ... les autres tests existants ...
});
