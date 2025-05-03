// Test d'intégration pour simuler le comportement du bot
const tmi = require('tmi.js');
const commandHandler = require('../../commands');
const inventory = require('../../data/inventory');
const users = require('../../data/users');
const cooldowns = require('../../data/cooldowns');

// Mocker les modules nécessaires
jest.mock('tmi.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(null),
    say: jest.fn().mockResolvedValue(null),
    on: jest.fn()
  }))
}));

jest.mock('../../commands', () => ({
  processCommand: jest.fn()
}));

jest.mock('../../data/inventory', () => ({
  loadInventories: jest.fn(),
  saveInventories: jest.fn(),
  setupAutoSave: jest.fn()
}));

jest.mock('../../data/users', () => ({
  recordUser: jest.fn(),
  loadUserMapping: jest.fn(),
  saveUserMapping: jest.fn(),
  setupAutoSave: jest.fn()
}));

jest.mock('../../data/cooldowns', () => ({
  loadCooldowns: jest.fn(),
  setupAutoSave: jest.fn()
}));

// Mocker dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Mocker process.env
const originalEnv = process.env;

describe('Bot Integration', () => {
  let mockClient;
  let mockEventHandlers = {};
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Restaurer process.env avant chaque test
    process.env = { ...originalEnv };
    
    // Simuler les variables d'environnement
    process.env.TWITCH_BOT_USERNAME = 'testbot';
    process.env.TWITCH_TOKEN = 'oauth:token';
    process.env.TWITCH_CHANNEL = 'testchannel';
    process.env.NODE_ENV = 'test';
    
    // Simuler tmi.Client.on pour capturer les gestionnaires d'événements
    tmi.Client.mockImplementation(() => {
      mockEventHandlers = {};
      mockClient = {
        connect: jest.fn().mockResolvedValue(null),
        say: jest.fn().mockResolvedValue(null),
        on: jest.fn().mockImplementation((event, handler) => {
          mockEventHandlers[event] = handler;
        })
      };
      return mockClient;
    });
    
    // Éviter de logger pendant les tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(() => {
    process.env = originalEnv;
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  test('le bot devrait initialiser correctement et se connecter', async () => {
    // Importer index.js qui démarrera le bot
    require('../../index');
    
    // Vérifier que tmi.Client a été appelé avec la bonne config
    expect(tmi.Client).toHaveBeenCalledWith(expect.objectContaining({
      identity: {
        username: 'testbot',
        password: 'oauth:token'
      },
      channels: ['testchannel']
    }));
    
    // Vérifier que connect a été appelé
    expect(mockClient.connect).toHaveBeenCalled();
    
    // Vérifier que les événements ont été configurés
    expect(mockEventHandlers).toHaveProperty('connected');
    expect(mockEventHandlers).toHaveProperty('message');
  });

  test('le bot devrait traiter les messages', () => {
    // Importer index.js qui démarrera le bot
    require('../../index');
    
    // Simuler un message entrant
    const mockUserstate = {
      username: 'testuser',
      'user-id': '123',
      'message-type': 'chat'
    };
    const mockMessage = '!hello';
    const mockChannel = '#testchannel';
    
    // Appeler le gestionnaire de message
    mockEventHandlers.message(mockChannel, mockUserstate, mockMessage, false);
    
    // Vérifier que l'utilisateur a été enregistré
    expect(users.recordUser).toHaveBeenCalledWith('testuser', '123');
    
    // Vérifier que la commande a été traitée
    expect(commandHandler.processCommand).toHaveBeenCalledWith(
      mockClient,
      mockChannel,
      mockUserstate,
      mockMessage
    );
  });

  test('le bot devrait ignorer ses propres messages', () => {
    // Importer index.js qui démarrera le bot
    require('../../index');
    
    // Simuler un message du bot lui-même
    const mockUserstate = {
      username: 'testbot',
      'user-id': 'bot-id',
      'message-type': 'chat'
    };
    const mockMessage = '!hello';
    const mockChannel = '#testchannel';
    
    // Appeler le gestionnaire de message avec self=true
    mockEventHandlers.message(mockChannel, mockUserstate, mockMessage, true);
    
    // Vérifier que la commande n'a PAS été traitée
    expect(commandHandler.processCommand).not.toHaveBeenCalled();
  });
});
