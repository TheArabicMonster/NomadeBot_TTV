/**
 * Commande pour ouvrir des caisses virtuelles CS2
 */
const config = require('../config/config');
const inventory = require('../data/inventory');
const cooldowns = require('../data/cooldowns');
const messages = require('../config/messages');
const rarities = require('../rarities');  // À déplacer dans data/ plus tard
const skins = require('../knives');       // À déplacer dans data/ plus tard

// Variable pour suivre l'animation en cours
let animationEnCours = false;

/**
 * Commande !knife - Ouvre une caisse virtuelle
 */
function openCase(client, channel, userstate) {
  const userId = userstate['user-id'];
  
  // Vérifier si une animation est en cours
  if (animationEnCours) {
    client.say(
      channel,
      messages.errorMessages.animation(userstate.username)
    );
    return;
  }
  
  // Vérifier le cooldown
  if (cooldowns.isOnCooldown(userId, 'knife')) {
    const remainingMinutes = cooldowns.getRemainingTime(userId, 'knife');
    client.say(
      channel,
      messages.errorMessages.cooldown(userstate.username, remainingMinutes)
    );
    return;
  }
  
  // Appliquer le cooldown
  cooldowns.setCooldown(userId, 'knife');
  
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