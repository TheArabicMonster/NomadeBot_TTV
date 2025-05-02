/**
 * Messages et textes utilisés par le bot
 */

// Messages périodiques aléatoires
const periodicMessages = [
  "👆 Cette personne est de mèche 🤝 avec Xi Jinping 🐉 ☝️",
  "👆 Cet utilisateur soutient 🗳️ le PCC 🇨🇳 ☝️🤔",
  "👆 ⚠️ Soupçonné de trahison 🤫 envers l'humanité 🌍 ⚠️ ☝️",
  "👆 🤡 Candidat officiel 🎖️ pour les Darwin Awards 💥 ☝️🏆",
  "👆 💀 A vendu son âme 🧾 pour quelques skins CS:GO 🔪 ☝️💰",
  "👆 🧠 A un QI négatif 📉 confirmé scientifiquement 🔬 ☝️",
  "👆 🚨 Recherché par Interpol 🕵️ pour crimes contre l'humanité 🎨 ☝️",
  "👆 🥶 Joue encore à CS:GO en 640x480 🖥️ pour 'meilleure perf' 💾 ☝️",
  "👆 🦀 A remplacé l'eau 💧 par du Monster Energy ⚡ ☝️🥤",
  "👆 🐢 Joue avec un PC 💻 de 2007 📦 et ça se voit 👓 ☝️⌛",
  "👆 🧂 Se fait mute 🔇 en 2 rounds 🕒 pour toxicité ☝️💢",
  "👆 🐄 Utilise encore Teamspeak en BIG 2025 ☝️📻",
  "👆 a déjà bark en vocal pour un knife ☝️🐕",
  "👆 🏳️‍🌈 Dans la rue on le confond 🧍 avec un femboy 💅 ☝️✨",
  "👆 🧠 Se prend pour Aizen Prime 🧥 mais fait encore pipi au lit 🛏️ ☝️",
  "👆 🎤 A déjà assisté 📚 à une conférence de Oussama Ammar 💼 ☝️📢",
  "👆 👔 CEO de la team 21 🕹️ ☝️👑",
  "👆 🐶 Bark en DM 📩 pour sa e-girl ☝️",
  "👆 🍕 A un régime alimentaire plus choquant 😨 que celui d'Hchizen ☝️🤢",
  "👆 Son QI est plus bas 📉 que son ping 📶 en pleine game 🚨☝️"
];

// Messages d'erreur
const errorMessages = {
  cooldown: (username, minutes) => `@${username}, tu dois attendre encore ${minutes} minute(s).`,
  animation: (username) => `@${username}, une animation est en cours! Attends qu'elle se termine.`,
  emptyInventory: (username, commandName) => `@${username}, tu n'as pas encore de skins dans ton inventaire. Utilise !${commandName} pour en obtenir!`,
  invalidUser: (username, targetName) => `@${username}, je ne trouve pas d'utilisateur nommé "${targetName}" dans mes données.`,
  invalidItem: (username) => `@${username}, cet item n'existe pas dans ton inventaire.`
};

// Réponses aux commandes réussies
const successMessages = {
  knife: (username, rarity, skinName) => `${rarity.emoji} @${username} ${rarity.message}: ${skinName} ${rarity.emoji}`,
  gift: (sender, recipient, rarity, skinName) => `🎁 @${sender} a offert ${rarity.emoji} ${skinName} à @${recipient}! Quel acte de générosité!`,
  stats: (username, totalCases, bestSkin, bestRarity, distribution) => 
    `@${username}, tu as ouvert ${totalCases} caisses. Ton meilleur skin: ${bestRarity.emoji} ${bestSkin}. Distribution: ${distribution}`
};

// Fonction pour démarrer les messages périodiques
function startPeriodicMessages(client, channel) {
  const config = require('./config');
  const { randomFromArray, randomBetween } = require('../utils/helpers');
  
  function sendMessage() {
    const message = randomFromArray(periodicMessages);
    client.say(channel, message);
    
    const nextInterval = randomBetween(
      config.periodicMessages.minInterval,
      config.periodicMessages.maxInterval
    );
    
    setTimeout(sendMessage, nextInterval);
  }
  
  // Démarrer la séquence avec le délai initial
  setTimeout(sendMessage, config.periodicMessages.initialDelay);
}

module.exports = {
  periodicMessages,
  errorMessages,
  successMessages,
  startPeriodicMessages
};