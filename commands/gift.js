/**
 * Commande gift pour offrir des skins à d'autres utilisateurs
 */
const inventory = require('../data/inventory');
const users = require('../data/users');
const rarities = require('../data/static/rarities');
const messages = require('../config/messages');

/**
 * Commande !gift - Offre un skin à un autre utilisateur
 */
function giftSkin(client, channel, userstate, args) {
  // Vérifier les arguments
  if (args.length < 2) {
    client.say(
      channel,
      `@${userstate.username}, utilisation correcte: !gift <utilisateur> <numéro item>`
    );
    return;
  }
  
  // Récupérer le nom du destinataire (sans @ initial)
  const targetUsername = args[0].replace(/^@/, '');
  
  // Convertir le numéro d'item (affiché à partir de 1, stocké à partir de 0)
  const itemNumber = parseInt(args[1]) - 1;
  if (isNaN(itemNumber) || itemNumber < 0) {
    client.say(
      channel,
      `@${userstate.username}, le numéro d'item doit être un nombre positif. Exemple: !gift ${targetUsername} 1`
    );
    return;
  }
  
  const senderId = userstate['user-id'];
  const senderInventory = inventory.getUserInventory(senderId);
  
  // Vérifier que l'inventaire existe et que l'index est valide
  if (!senderInventory || senderInventory.length === 0) {
    client.say(
      channel,
      `@${userstate.username}, ton inventaire est vide. Utilise !knife pour obtenir des skins!`
    );
    return;
  }
  
  if (itemNumber >= senderInventory.length) {
    client.say(
      channel,
      `@${userstate.username}, tu n'as que ${senderInventory.length} items dans ton inventaire. Choisis un numéro entre 1 et ${senderInventory.length}.`
    );
    return;
  }
  
  // Trouver l'ID utilisateur du destinataire
  const targetId = users.findUserIdByUsername(targetUsername);
  
  if (!targetId) {
    client.say(
      channel,
      messages.errorMessages.invalidUser(userstate.username, targetUsername)
    );
    return;
  }
  
  // Ne pas permettre de s'offrir un skin à soi-même
  if (targetId === senderId) {
    client.say(
      channel,
      `@${userstate.username}, tu ne peux pas t'offrir un skin à toi-même!`
    );
    return;
  }
  
  // Retirer le skin de l'inventaire de l'expéditeur
  const gift = inventory.removeSkinFromInventory(senderId, itemNumber);
  
  if (!gift) {
    client.say(
      channel,
      messages.errorMessages.invalidItem(userstate.username)
    );
    return;
  }
  
  // Ajouter le skin à l'inventaire du destinataire
  inventory.addSkinToInventory(targetId, gift);
  
  // Sauvegarder les inventaires
  inventory.saveInventories();
  
  // Trouver la rareté pour l'affichage
  const giftRarity = rarities.find(r => r.id === gift.rarity);
  
  // Annoncer le don
  client.say(
    channel,
    messages.successMessages.gift(userstate.username, targetUsername, giftRarity, gift.name)
  );
}

module.exports = {
  giftSkin
};