/**
 * Point d'entrée pour toutes les commandes du bot
 * Ce fichier importe et exporte toutes les commandes disponibles
 */
const basicCommands = require('./basic');
const inventoryCommands = require('./inventory');
const knifeCommand = require('./knife');
const statsCommands = require('./stats');
const giftCommand = require('./gift');  

// Mapper les noms de commandes à leurs gestionnaires
const commandHandlers = {
  // Commandes de base
  help: basicCommands.help,
  commandes: basicCommands.help,
  hello: basicCommands.hello,
  dice: basicCommands.dice,
  info: basicCommands.info,
  
  // Commandes d'inventaire
  inventaire: inventoryCommands.showInventory,
  search: inventoryCommands.searchInventory,
  
  // Commande knife
  knife: knifeCommand.openCase,
  
  // Commandes de stats
  stats: statsCommands.showStats,
  top: statsCommands.showLeaderboard,
  leaderboard: statsCommands.showLeaderboard,
  chance: statsCommands.showChances,
  
  // Commande gift (renommé)
  gift: giftCommand.giftSkin
};

/**
 * Traite une commande reçue
 */
function processCommand(client, channel, userstate, message) {
  // Extraction de la commande et des arguments
  const fullCommand = message.trim();
  const commandParts = fullCommand.split(' ');
  const cmdName = commandParts[0].substring(1).toLowerCase(); // Enlève le "!"
  const args = commandParts.slice(1);
  
  // Vérifier si la commande existe
  const handler = commandHandlers[cmdName];
  if (handler) {
    try {
      handler(client, channel, userstate, args, fullCommand);
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la commande ${cmdName}:`, error);
      client.say(channel, `@${userstate.username}, une erreur s'est produite lors de l'exécution de cette commande.`);
    }
  }
}

module.exports = {
  processCommand,
  commandHandlers
};