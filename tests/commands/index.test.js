const commandHandler = require('../../commands');
const basicCommands = require('../../commands/basic');
const knifeCommand = require('../../commands/knife');
const inventoryCommands = require('../../commands/inventory');
const statsCommands = require('../../commands/stats');

// Mocker les modules des commandes
jest.mock('../../commands/basic', () => ({
  help: jest.fn(),
  hello: jest.fn(),
  dice: jest.fn(),
  info: jest.fn()
}));

jest.mock('../../commands/knife', () => ({
  openCase: jest.fn()
}));

jest.mock('../../commands/inventory', () => ({
  showInventory: jest.fn(),
  searchInventory: jest.fn()
}));

jest.mock('../../commands/stats', () => ({
  showStats: jest.fn(),
  showLeaderboard: jest.fn(),
  showChances: jest.fn()
}));

describe('Command Handler', () => {
  let mockClient;
  let mockChannel;
  let mockUserstate;
  
  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
    
    mockClient = {};
    mockChannel = '#testchannel';
    mockUserstate = { username: 'testuser' };
    
    // Mock console.error pour éviter de spammer les logs de test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    console.error.mockRestore();
  });

  test('devrait traiter une commande help', () => {
    commandHandler.processCommand(mockClient, mockChannel, mockUserstate, '!help');
    expect(basicCommands.help).toHaveBeenCalledWith(mockClient, mockChannel, mockUserstate, [], '!help'.slice(1));
  });
  
  test('devrait traiter une commande hello', () => {
    commandHandler.processCommand(mockClient, mockChannel, mockUserstate, '!hello');
    expect(basicCommands.hello).toHaveBeenCalledWith(mockClient, mockChannel, mockUserstate, [], '!hello'.slice(1));
  });
  
  test('devrait traiter une commande knife', () => {
    commandHandler.processCommand(mockClient, mockChannel, mockUserstate, '!skin');
    expect(knifeCommand.openCase).toHaveBeenCalledWith(mockClient, mockChannel, mockUserstate, [], '!skin'.slice(1));
  });
  
  test('devrait traiter une commande inventaire avec des arguments', () => {
    commandHandler.processCommand(mockClient, mockChannel, mockUserstate, '!inventaire 2');
    expect(inventoryCommands.showInventory).toHaveBeenCalledWith(mockClient, mockChannel, mockUserstate, ['2'], '!inventaire 2'.slice(1));
  });
  
  test('devrait traiter une commande search', () => {
    commandHandler.processCommand(mockClient, mockChannel, mockUserstate, '!search awp');
    expect(inventoryCommands.searchInventory).toHaveBeenCalledWith(mockClient, mockChannel, mockUserstate, ['awp'], '!search awp'.slice(1));
  });
  
  test('devrait gérer les erreurs lors de l\'exécution des commandes', () => {
    // Faire en sorte que la commande lève une erreur
    basicCommands.hello.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // La fonction devrait capturer l'erreur sans planter
    expect(() => {
      commandHandler.processCommand(mockClient, mockChannel, mockUserstate, '!hello');
    }).not.toThrow();
    
    // L'erreur devrait être enregistrée
    expect(console.error).toHaveBeenCalled();
  });
  
  test('ne devrait rien faire si le message ne commence pas par le préfixe', () => {
    commandHandler.processCommand(mockClient, mockChannel, mockUserstate, 'hello');
    expect(basicCommands.hello).not.toHaveBeenCalled();
  });
  
  test('ne devrait rien faire si la commande n\'existe pas', () => {
    commandHandler.processCommand(mockClient, mockChannel, mockUserstate, '!commandeinconnue');
    expect(basicCommands.hello).not.toHaveBeenCalled();
  });
});
