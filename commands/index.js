/**
 * Point d'entrée pour toutes les commandes du bot
 * Charge les différentes commandes et les expose via une fonction processCommand
 */
const basicCommands = require('./basic');
const inventoryCommands = require('./inventory');
const knifeCommand = require('./knife');
const statsCommands = require('./stats');

// Mappage des noms de commandes aux fonctions de traitement
const commandMap = {
  // Commandes de base
  help: basicCommands.help,
  commandes: basicCommands.help,
  hello: basicCommands.hello,
  dice: basicCommands.dice,
  info: basicCommands.info,
  
  // Commandes d'inventaire
  knife: knifeCommand.openCase,
  inventaire: inventoryCommands.showInventory,
  search: inventoryCommands.searchInventory,
  
  // Commandes de statistiques
  stats: statsCommands.showStats,
  top: statsCommands.showLeaderboard,
  leaderboard: statsCommands.showLeaderboard,
  chance: statsCommands.showChances, // Virgule manquante ici
  
  // Commande sociale - à implémenter
  // gift: socialCommands.giftSkin
};

/**
 * Traite une commande entrée par l'utilisateur
 */
function processCommand(client, channel, userstate, message) {
  const config = require('../config/config');
  
  // Vérifier que le message commence par le préfixe
  if (!message.startsWith(config.commands.prefix)) {
    return;
  }
  
  // Extraire le nom de la commande et les arguments
  const parts = message.slice(config.commands.prefix.length).trim().split(' ');
  const commandName = config.commands.caseSensitive ? parts[0] : parts[0].toLowerCase();
  const args = parts.slice(1);
  
  // Trouver et exécuter la commande
  const command = commandMap[commandName];
  if (command) {
    try {
      command(client, channel, userstate, args, message.slice(config.commands.prefix.length));
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
      client.say(channel, `@${userstate.username}, une erreur s'est produite lors de l'exécution de cette commande.`);
    }
  }
}

module.exports = {
  processCommand,
  commandMap
};