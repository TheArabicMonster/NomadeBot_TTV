const messageQueue = require('../../utils/messageQueue');
const logger = require('../../utils/logger');

// Mocker le module logger
jest.mock('../../utils/logger', () => ({
  debug: jest.fn(),
  error: jest.fn()
}));

describe('Message Queue', () => {
  let mockClient;
  let mockChannel;
  
  beforeEach(() => {
    // Reset des timers et des mocks
    jest.useFakeTimers();
    jest.clearAllMocks();
    
    // Reset des mocks
    logger.debug.mockClear();
    logger.error.mockClear();
    
    // Créer un client mock
    mockClient = {
      say: jest.fn().mockResolvedValue(true)
    };
    
    mockChannel = '#testchannel';
    
    // Réinitialiser l'état interne du module messageQueue
    // On peut utiliser cette approche pour "réinitialiser" le module entre les tests
    jest.isolateModules(() => {
      const resetModule = require('../../utils/messageQueue');
      // Le module est maintenant réinitialisé
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('devrait ajouter un message à la file d\'attente', () => {
    messageQueue.enqueue(mockClient, mockChannel, 'Test message');
    
    // Vérifier que le message a été loggé
    expect(logger.debug).toHaveBeenCalledWith('Message ajouté à la file d\'attente: Test message');
  });

  test('devrait traiter un message de la file d\'attente', () => {
    messageQueue.enqueue(mockClient, mockChannel, 'Test message');
    
    // Avancer le temps pour que le message soit traité
    jest.runAllTimers();
    
    // Vérifier que le client.say a été appelé avec les bons arguments
    expect(mockClient.say).toHaveBeenCalledWith(mockChannel, 'Test message');
    
    // Vérifier que le succès a été loggé
    expect(logger.debug).toHaveBeenCalledWith('Message envoyé: Test message');
  });

  test('devrait gérer plusieurs messages dans la file d\'attente', () => {
    messageQueue.enqueue(mockClient, mockChannel, 'Message 1');
    messageQueue.enqueue(mockClient, mockChannel, 'Message 2');
    messageQueue.enqueue(mockClient, mockChannel, 'Message 3');
    
    // Traiter le premier message
    jest.advanceTimersByTime(1500); // Attendre le délai entre les messages
    expect(mockClient.say).toHaveBeenCalledWith(mockChannel, 'Message 1');
    
    // Traiter le deuxième message
    jest.advanceTimersByTime(1500);
    expect(mockClient.say).toHaveBeenCalledWith(mockChannel, 'Message 2');
    
    // Traiter le troisième message
    jest.advanceTimersByTime(1500);
    expect(mockClient.say).toHaveBeenCalledWith(mockChannel, 'Message 3');
    
    // Vérifier que client.say a été appelé exactement 3 fois
    expect(mockClient.say).toHaveBeenCalledTimes(3);
  });

  test('devrait gérer une erreur lors de l\'envoi d\'un message', () => {
    // Configurer le mock pour rejeter la promesse
    mockClient.say.mockRejectedValueOnce(new Error('Test error'));
    
    messageQueue.enqueue(mockClient, mockChannel, 'Error message');
    
    // Avancer le temps pour que le message soit traité
    jest.runAllTimers();
    
    // Vérifier que l'erreur a été loggée
    expect(logger.error).toHaveBeenCalledWith('Erreur lors de l\'envoi du message: Test error');
  });
});
