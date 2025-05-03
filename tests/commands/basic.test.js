const basicCommands = require('../../commands/basic');
const messageQueue = require('../../utils/messageQueue');

// Mocker le module messageQueue
jest.mock('../../utils/messageQueue', () => ({
  enqueue: jest.fn()
}));

describe('Commandes basiques', () => {
  let mockClient;
  let mockChannel;
  let mockUserstate;
  
  beforeEach(() => {
    // Reset des mocks
    messageQueue.enqueue.mockClear();
    
    mockClient = {};
    mockChannel = '#testchannel';
    mockUserstate = { username: 'testuser' };
  });

  test('commande help devrait envoyer la liste des commandes', () => {
    basicCommands.help(mockClient, mockChannel, mockUserstate);
    
    expect(messageQueue.enqueue).toHaveBeenCalledWith(
      mockClient,
      mockChannel,
      expect.stringMatching(/@testuser.+commandes disponibles/)
    );
  });

  test('commande hello devrait saluer l\'utilisateur', () => {
    basicCommands.hello(mockClient, mockChannel, mockUserstate);
    
    expect(messageQueue.enqueue).toHaveBeenCalledWith(
      mockClient,
      mockChannel,
      expect.stringMatching(/Hey @testuser/)
    );
  });

  test('commande dice devrait lancer un dé', () => {
    // Mock Math.random pour avoir un résultat prévisible
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5; // Donne 3 avec Math.floor(Math.random() * 6) + 1
    global.Math = mockMath;
    
    basicCommands.dice(mockClient, mockChannel, mockUserstate);
    
    expect(messageQueue.enqueue).toHaveBeenCalledWith(
      mockClient,
      mockChannel,
      expect.stringMatching(/@testuser lance un dé et obtient un 4!/)
    );
  });

  test('commande info devrait afficher les informations du bot', () => {
    basicCommands.info(mockClient, mockChannel, mockUserstate);
    
    expect(messageQueue.enqueue).toHaveBeenCalledWith(
      mockClient,
      mockChannel,
      expect.stringMatching(/NomadeBot - Un bot qui permet/)
    );
  });
});
