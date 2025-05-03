/**
 * Gestion des cooldowns des commandes
 */
const config = require('../config/config');

// Stockage des cooldowns (userId -> commande -> timestamp)
let cooldowns = {};

/**
 * Vérifie si un utilisateur est en cooldown pour une commande
 */
function isOnCooldown(userId, command) {
  if (!cooldowns[userId] || !cooldowns[userId][command]) {
    return false;
  }

  const now = Date.now();
  const commandCooldown = config.cooldowns[command] || 0;
  const userCooldownEnd = cooldowns[userId][command] + commandCooldown;

  return now < userCooldownEnd;
}

/**
 * Obtient le temps restant avant la fin du cooldown (en minutes)
 */
function getRemainingTime(userId, command) {
  if (!cooldowns[userId] || !cooldowns[userId][command]) {
    return 0;
  }

  const now = Date.now();
  const commandCooldown = config.cooldowns[command] || 0;
  const userCooldownEnd = cooldowns[userId][command] + commandCooldown;
  
  const remainingMs = Math.max(0, userCooldownEnd - now);
  return Math.ceil(remainingMs / (60 * 1000)); // Conversion en minutes
}

/**
 * Applique un cooldown à un utilisateur pour une commande
 */
function setCooldown(userId, command) {
  if (!cooldowns[userId]) {
    cooldowns[userId] = {};
  }
  
  cooldowns[userId][command] = Date.now();
}

/**
 * Réinitialise tous les cooldowns (utile pour les tests)
 */
function resetAllCooldowns() {
  cooldowns = {};
}

module.exports = {
  isOnCooldown,
  getRemainingTime,
  setCooldown,
  resetAllCooldowns
};