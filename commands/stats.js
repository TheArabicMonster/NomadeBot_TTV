/**
 * Commandes liées aux statistiques
 */
const inventory = require('../data/inventory');
const users = require('../data/users');
const rarities = require('../data/static/rarities');
const config = require('../config/config');

/**
 * Commande !stats - Affiche les statistiques d'un utilisateur
 */
function showStats(client, channel, userstate) {
  const userId = userstate['user-id'];
  const userInventory = inventory.getUserInventory(userId);
  
  if (!userInventory || userInventory.length === 0) {
    client.say(
      channel,
      `@${userstate.username}, tu n'as pas encore ouvert de caisses. Utilise !knife pour commencer!`
    );
    return;
  }
  
  // Nombre total de caisses ouvertes
  const totalCases = userInventory.length;
  
  // Meilleur skin (basé sur la rareté)
  const bestSkin = [...userInventory].sort((a, b) => {
    const rarityA = rarities.findIndex(r => r.id === a.rarity);
    const rarityB = rarities.findIndex(r => r.id === b.rarity);
    return rarityB - rarityA;
  })[0];
  
  const bestSkinRarity = rarities.find(r => r.id === bestSkin.rarity);
  
  // Distribution des skins par rareté
  const distribution = {};
  rarities.forEach(rarity => {
    distribution[rarity.id] = userInventory.filter(
      skin => skin.rarity === rarity.id
    ).length;
  });
  
  // Formatage de la distribution pour affichage
  const distributionText = rarities
    .filter(rarity => distribution[rarity.id] > 0)
    .map(rarity => `${rarity.emoji} ${distribution[rarity.id]}`)
    .join(", ");
  
  client.say(
    channel,
    `@${userstate.username}, tu as ouvert ${totalCases} caisses. Ton meilleur skin: ${bestSkinRarity.emoji} ${bestSkin.name}. Distribution: ${distributionText}`
  );
}

/**
 * Commande !top or !leaderboard - Affiche les meilleurs inventaires
 */
function showLeaderboard(client, channel) {
  const allInventories = inventory.getAllInventories();
  
  // Liste d'utilisateurs avec leur meilleur skin
  const users = [];
  
  // Parcourir tous les inventaires
  for (const userId in allInventories) {
    if (allInventories[userId] && allInventories[userId].length > 0) {
      // Trouver le meilleur skin pour cet utilisateur
      const bestSkin = [...allInventories[userId]].sort((a, b) => {
        const rarityA = rarities.findIndex(r => r.id === a.rarity);
        const rarityB = rarities.findIndex(r => r.id === b.rarity);
        return rarityB - rarityA;
      })[0];
      
      users.push({
        userId: userId,
        bestSkin: bestSkin,
        rarityIndex: rarities.findIndex(r => r.id === bestSkin.rarity)
      });
    }
  }
  
  if (users.length === 0) {
    client.say(
      channel,
      `Aucun utilisateur n'a encore ouvert de caisses. Soyez le premier avec !knife!`
    );
    return;
  }
  
  // Trier par rareté décroissante
  users.sort((a, b) => b.rarityIndex - a.rarityIndex);
  
  // Afficher les 5 premiers
  const maxResults = config.display.maxResultsPerList;
  const topUsers = users.slice(0, maxResults).map((user, index) => {
    const userRarity = rarities[user.rarityIndex];
    const username = require('../data/users').getUsernameById(user.userId);
    return `${index + 1}. @${username} - ${userRarity.emoji} ${user.bestSkin.name}`;
  }).join(" | ");
  
  client.say(
    channel,
    `🏆 TOP ${Math.min(maxResults, users.length)} INVENTAIRES: ${topUsers}`
  );
}

/**
 * Commande !chance - Affiche les probabilités d'obtention
 */
function showChances(client, channel) {
  const chances = rarities.map(rarity => 
    `${rarity.emoji} ${rarity.name}: ${rarity.probability.toFixed(2)}%`
  ).join(" | ");
  
  client.say(
    channel,
    `💯 Chances d'obtention: ${chances}`
  );
}

module.exports = {
  showStats,
  showLeaderboard,
  showChances
};