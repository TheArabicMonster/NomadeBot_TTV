/**
 * Commande !daily - Permet de récupérer une récompense quotidienne
 */
const inventory = require('../data/inventory');
const cooldowns = require('../data/cooldowns');
const messages = require('../config/messages');
const helpers = require('../utils/helpers');
const dailyRewards = require('../data/static/dailyRewards');
const rarities = require('../data/static/rarities');

/**
 * Détermine la rareté de la récompense quotidienne en fonction des probabilités
 * @returns {string} Le nom de la catégorie de rareté
 */
function determineRewardType() {
  const roll = Math.random() * 100;
  
  // 1% de chance d'obtenir un item mythique
  if (roll < 1) {
    return 'mythic';
  }
  
  // 4% de chance d'obtenir un item légendaire
  if (roll < 5) {
    return 'legendary';
  }
  
  // 10% de chance d'obtenir un item rare
  if (roll < 15) {
    return 'rare';
  }
  
  // 20% de chance d'obtenir un item peu commun
  if (roll < 35) {
    return 'uncommon';
  }
  
  // 65% de chance d'obtenir un item commun
  return 'common';
}

/**
 * Sélectionne une récompense quotidienne pour l'utilisateur
 * @returns {Object} Objet contenant la récompense et sa rareté
 */
function selectDailyReward() {
  // Déterminer le type de récompense
  const rewardType = determineRewardType();
  
  let reward;
  let rarity;
  
  // Sélectionner une récompense basée sur la rareté
  switch(rewardType) {
    case 'mythic':
      reward = helpers.getRandomElement(dailyRewards.mythic);
      rarity = 'mythical';
      break;
    case 'legendary':
      reward = helpers.getRandomElement(dailyRewards.legendary);
      rarity = 'legendary';
      break;
    case 'rare':
      reward = helpers.getRandomElement(dailyRewards.rare);
      rarity = 'rare';
      break;
    case 'uncommon':
      reward = helpers.getRandomElement(dailyRewards.uncommon);
      rarity = 'uncommon';
      break;
    default:
      reward = helpers.getRandomElement(dailyRewards.common);
      rarity = 'common';
  }

  return { name: reward, rarity: rarity };
}

/**
 * Exécute la commande !daily
 * @param {Object} client - Client Twitch
 * @param {string} channel - Canal sur lequel la commande est exécutée
 * @param {Object} userstate - Information sur l'utilisateur
 */
function claimDailyReward(client, channel, userstate) {
  const userId = userstate['user-id'];
  const username = userstate.username;
  
  // Vérifier si l'utilisateur est en cooldown
  if (cooldowns.isOnCooldown(userId, 'daily')) {
    const remainingMinutes = cooldowns.getRemainingTime(userId, 'daily');
    const remainingHours = Math.floor(remainingMinutes / 60);
    const minutesLeft = remainingMinutes % 60;
    
    let timeMessage = '';
    if (remainingHours > 0) {
      timeMessage = `${remainingHours} heure(s) et ${minutesLeft} minute(s)`;
    } else {
      timeMessage = `${remainingMinutes} minute(s)`;
    }
    
    client.say(
      channel,
      `@${username}, tu as déjà réclamé ta récompense quotidienne ! Tu dois attendre encore ${timeMessage}.`
    );
    return;
  }
  
  // Sélectionner une récompense
  const reward = selectDailyReward();
  
  // Ajouter l'item à l'inventaire de l'utilisateur
  const itemObject = {
    name: reward.name,
    rarity: reward.rarity,
    obtainedAt: new Date().toISOString()
  };
  
  inventory.addSkinToInventory(userId, itemObject);
  
  // Appliquer le cooldown
  cooldowns.setCooldown(userId, 'daily');
  
  // Trouver la rareté pour l'affichage
  const rarityInfo = rarities.find(r => r.id === reward.rarity);
  
  // Construire le message de récompense
  let rewardMessage = `@${username}, voici ta récompense quotidienne: ${rarityInfo ? rarityInfo.emoji + ' ' : ''}${reward.name}`;
  
  // Ajouter un message spécial selon la rareté
  if (reward.rarity === 'mythical') {
    rewardMessage += " ✨ INCROYABLE! Tu as obtenu un objet mythique! ✨";
  } else if (reward.rarity === 'legendary') {
    rewardMessage += " 🌟 Félicitations! C'est un objet légendaire! 🌟";
  } else if (reward.rarity === 'rare') {
    rewardMessage += " 💫 Belle trouvaille! Un objet rare! 💫";
  } else if (reward.rarity === 'uncommon') {
    rewardMessage += " 👍 Pas mal! Un objet peu commun!";
  } else {
    rewardMessage += " 🪨 Un objet commun, mais qui pourrait s'avérer utile!";
  }
  
  // Envoyer le message de récompense
  client.say(channel, rewardMessage);
}

module.exports = {
  claimDailyReward
};