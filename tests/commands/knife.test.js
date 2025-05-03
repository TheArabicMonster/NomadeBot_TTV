const knifeCommand = require('../../commands/knife');
const inventory = require('../../data/inventory');
const cooldowns = require('../../data/cooldowns');
const messages = require('../../config/messages');
const rarities = require('../../data/static/rarities');
const skins = require('../../data/static/knives');

// Mocker les modules nécessaires
jest.mock('../../data/inventory', () => ({
  addSkinToInventory: jest.fn().mockReturnValue(true)
}));

jest.mock('../../data/cooldowns', () => ({
  isOnCooldown: jest.fn(),
  getRemainingTime: jest.fn(),
  setCooldown: jest.fn()
}));

jest.mock('../../config/messages', () => ({
  errorMessages: {
    cooldown: jest.fn().mockReturnValue('cooldown message'),
    animation: jest.fn().mockReturnValue('animation message')
  },
  successMessages: {
    knife: jest.fn().mockReturnValue('success message')
  }
}));

jest.mock('../../data/static/rarities', () => [
  {
    id: "mil-spec",
    name: "Qualité Militaire",
    color: "#4b69ff",
    emoji: "🔵",
    probability: 79.92,
    message: "a obtenu un skin mil-spec"
  },
  {
    id: "extraordinary",
    name: "★ Exceptionnel ★",
    color: "#caab05",
    emoji: "🔪",
    probability: 0.26,
    message: "a ouvert un COUTEAU!"
  }
]);

jest.mock('../../data/static/knives', () => ({
  'mil-spec': ['AK-47 | Test Skin'],
  'extraordinary': ['★ Karambit | Test Skin']
}));

// Mock pour Math.random
const mockMath = Object.create(global.Math);

describe('Knife Command', () => {
  let mockClient;
  let mockChannel;
  let mockUserstate;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockClient = { say: jest.fn() };
    mockChannel = '#testchannel';
    mockUserstate = { 
      username: 'testuser',
      'user-id': '123456'
    };
    
    // Reset l'état de l'animation
    jest.spyOn(Object.getPrototypeOf(knifeCommand), 'animationEnCours', 'get')
      .mockReturnValue(false);
    
    // Configuration par défaut des mocks
    cooldowns.isOnCooldown.mockReturnValue(false);
    global.Math = mockMath;
  });
  
  afterEach(() => {
    global.Math = Math;
  });

  test('devrait ouvrir une caisse et obtenir un skin commun', () => {
    // Mock Math.random pour obtenir un skin commun
    mockMath.random = () => 0.1; // Pour obtenir mil-spec
    
    knifeCommand.openCase(mockClient, mockChannel, mockUserstate);
    
    // Vérifications
    expect(cooldowns.setCooldown).toHaveBeenCalledWith('123456', 'knife');
    expect(inventory.addSkinToInventory).toHaveBeenCalledWith('123456', expect.objectContaining({
      name: 'AK-47 | Test Skin',
      rarity: 'mil-spec'
    }));
    expect(mockClient.say).toHaveBeenCalledWith(mockChannel, 'success message');
  });
  
  test('ne devrait pas ouvrir de caisse pendant un cooldown', () => {
    cooldowns.isOnCooldown.mockReturnValue(true);
    cooldowns.getRemainingTime.mockReturnValue(5);
    
    knifeCommand.openCase(mockClient, mockChannel, mockUserstate);
    
    expect(cooldowns.setCooldown).not.toHaveBeenCalled();
    expect(inventory.addSkinToInventory).not.toHaveBeenCalled();
    expect(mockClient.say).toHaveBeenCalledWith(mockChannel, 'cooldown message');
  });
  
  test('ne devrait pas ouvrir de caisse pendant une animation', () => {
    // Simuler une animation en cours
    jest.spyOn(Object.getPrototypeOf(knifeCommand), 'animationEnCours', 'get')
      .mockReturnValue(true);
    
    knifeCommand.openCase(mockClient, mockChannel, mockUserstate);
    
    expect(cooldowns.setCooldown).not.toHaveBeenCalled();
    expect(inventory.addSkinToInventory).not.toHaveBeenCalled();
    expect(mockClient.say).toHaveBeenCalledWith(mockChannel, 'animation message');
  });
  
  test('devrait déclencher une animation pour un couteau', () => {
    // Simuler l'obtention d'un couteau
    mockMath.random = () => 0.999; // Pour obtenir extraordinary
    
    // Espionner setTimeout
    jest.useFakeTimers();
    
    knifeCommand.openCase(mockClient, mockChannel, mockUserstate);
    
    expect(inventory.addSkinToInventory).toHaveBeenCalledWith('123456', expect.objectContaining({
      name: expect.stringContaining('★'),
      rarity: 'extraordinary'
    }));
    
    // Vérifier que l'animation est terminée après le setTimeout
    jest.runAllTimers();
    expect(Object.getPrototypeOf(knifeCommand).animationEnCours).toBe(false);
    
    jest.useRealTimers();
  });
});
