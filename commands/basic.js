/**
 * Commandes basiques du bot (hello, dice, info, help)
 */
const config = require('../config/config');

/**
 * Commande !help ou !commandes - Liste les commandes disponibles
 */
function help(client, channel, userstate) {
  client.say(
    channel,
    `@${userstate.username}, voici les commandes disponibles : !hello, !dice, !info, !knife, !inventaire, !stats, !top, !chance, !gift <utilisateur> <numéro>, !search <terme>`
  );
}

/**
 * Commande !hello - Salue l'utilisateur
 */
function hello(client, channel, userstate) {
  client.say(
    channel,
    `👋 Hey @${userstate.username}, bienvenue dans le stream!`
  );
}

/**
 * Commande !dice - Lance un dé à 6 faces
 */
function dice(client, channel, userstate) {
  const roll = Math.floor(Math.random() * 6) + 1;
  client.say(
    channel,
    `🎲 @${userstate.username} lance un dé et obtient un ${roll}!`
  );
}

/**
 * Commande !info - Affiche des informations sur le bot
 */
function info(client, channel, userstate) {
  client.say(
    channel,
    `ℹ️ NomadeBot - Un bot qui permet d'ouvrir des caisses CS2 virtuelles. Développé par Nomade, utilisez !help pour voir les commandes disponibles.`
  );
}

module.exports = {
  help,
  hello,
  dice,
  info
};