/**
 * Commande pour ouvrir des caisses virtuelles CS2
 */
const config = require('../config/config');
const inventory = require('../data/inventory');
const cooldowns = require('../data/cooldowns');
const messages = require('../config/messages');
// Ces imports sont incorrects - il faut pointer vers data/static
const rarities = require('../data/static/rarities');  // Corriger ce chemin
const skins = require('../data/static/knives');       // Corriger ce chemin

// Variable pour suivre l'animation en cours
let animationEnCours = false;

/**
 * Commande !knife/!skin - Ouvre une caisse virtuelle
 * @param {Object} client - Le client Twitch
 * @param {string} channel - Le canal où la commande est exécutée
 * @param {Object} userstate - Les informations sur l'utilisateur
 * @param {string} [commandName='knife'] - Le nom de la commande pour le cooldown (par défaut 'knife')
 */
function openCase(client, channel, userstate, commandName = 'knife') {
  const userId = userstate['user-id'];
  
  // Vérifier si une animation est en cours
  if (animationEnCours) {
    client.say(
      channel,
      messages.errorMessages.animation(userstate.username)
    );
    return;
  }
  
  // Vérifier le cooldown - Utiliser le nom de commande passé en paramètre
  if (cooldowns.isOnCooldown(userId, commandName)) {
    const remainingMinutes = cooldowns.getRemainingTime(userId, commandName);
    client.say(
      channel,
      messages.errorMessages.cooldown(userstate.username, remainingMinutes)
    );
    return;
  }
  
  // Appliquer le cooldown - Utiliser le nom de commande passé en paramètre
  cooldowns.setCooldown(userId, commandName);
  
  // Logique de tirage aléatoire pour déterminer la rareté
  const roll = Math.random() * 100;
  let cumulativeProbability = 0;
  let obtainedRarity = null;
  
  for (const rarity of rarities) {
    cumulativeProbability += rarity.probability;
    if (roll <= cumulativeProbability) {
      obtainedRarity = rarity;
      break;
    }
  }
  
  // Récupération des skins disponibles dans la catégorie
  const skinsInCategory = skins[obtainedRarity.id];
  if (!skinsInCategory || skinsInCategory.length === 0) {
    console.error(`Aucun skin trouvé pour la rareté: ${obtainedRarity.id}`);
    client.say(channel, `@${userstate.username}, erreur lors de l'ouverture de la caisse. Veuillez réessayer.`);
    return;
  }
  
  // Sélection aléatoire d'un skin dans la catégorie
  const randomSkin = skinsInCategory[Math.floor(Math.random() * skinsInCategory.length)];
  
  // Création de l'objet skin pour l'inventaire
  const skinObject = {
    name: randomSkin,
    rarity: obtainedRarity.id,
    color: obtainedRarity.color,
    obtainedAt: new Date().toISOString()
  };
  
  // Ajout du skin à l'inventaire
  inventory.addSkinToInventory(userId, skinObject);
  
  // Animation spéciale pour les couteaux (rareté extraordinaire)
  if (obtainedRarity.id === 'extraordinary') {
    animationEnCours = true;
    setTimeout(() => {
      animationEnCours = false;
    }, config.animations.knife);
  }
  
  // Envoi du message de résultat
  client.say(
    channel,
    messages.successMessages.knife(userstate.username, obtainedRarity, randomSkin)
  );
}

module.exports = {
  openCase
};