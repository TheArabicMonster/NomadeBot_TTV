/**
 * Test manuel pour le bot Twitch
 * 
 * Ce script permet de simuler des interactions avec le bot sans avoir à se connecter à Twitch.
 * Il est utile pour tester rapidement des fonctionnalités spécifiques.
 * 
 * Usage: node manualTest.js [commande] [arguments...]
 * Exemple: node manualTest.js knife
 * Exemple: node manualTest.js inventaire
 */

// Importer la configuration de test
const { setupTestEnvironment, cleanupTestEnvironment } = require('./setup');

// Initialiser l'environnement de test
setupTestEnvironment();

// Créer un client Twitch factice
const mockTwitchClient = {
  say: (channel, message) => {
    console.log(`[BOT → ${channel}]: ${message}`);
  }
};

// Créer un userstate factice
const mockUserstate = {
  username: 'test_user',
  'user-id': 'test123',
  'display-name': 'Test_User',
  'message-type': 'chat'
};

// Récupérer la commande depuis les arguments
const [, , command, ...args] = process.argv;
const commandWithPrefix = command ? `!${command}` : '';
const fullCommand = [commandWithPrefix, ...args].join(' ');
const channel = '#test_channel';

// Si aucune commande n'est fournie, afficher l'aide
if (!command) {
  console.log('Usage: node manualTest.js [commande] [arguments...]');
  console.log('Exemple: node manualTest.js knife');
  console.log('Exemple: node manualTest.js inventaire 2');
  process.exit(0);
}

// Simuler l'exécution du bot
async function runTest() {
  console.log('\n🤖 Test manuel du bot Twitch');
  console.log('=============================\n');
  
  console.log(`👤 Utilisateur: ${mockUserstate.username}`);
  console.log(`📝 Commande: ${fullCommand}`);
  console.log(`📺 Canal: ${channel}\n`);
  
  try {
    // Charger et exécuter la commande
    const commandHandler = require('../../commands');
    
    console.log('🚀 Exécution de la commande...\n');
    
    // Traiter la commande
    await commandHandler.processCommand(
      mockTwitchClient, 
      channel,
      mockUserstate,
      fullCommand
    );
    
    console.log('\n✅ Test terminé avec succès\n');
  } catch (error) {
    console.error('\n❌ Erreur pendant le test:', error);
  }
  
  // Nettoyer l'environnement de test
  cleanupTestEnvironment();
}

// Exécuter le test
runTest();
