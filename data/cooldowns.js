/**
 * Gestion des cooldowns des commandes
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Stockage des cooldowns (userId -> commande -> timestamp)
let cooldowns = {};

// Chemin du fichier de sauvegarde
const cooldownsFilePath = path.join(__dirname, '..', config.storage.files.cooldowns);

/**
 * Charge les cooldowns depuis le fichier
 */
function loadCooldowns() {
  try {
    if (fs.existsSync(cooldownsFilePath)) {
      const data = fs.readFileSync(cooldownsFilePath, 'utf8');
      cooldowns = JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des cooldowns:', error);
  }
}

/**
 * Sauvegarde les cooldowns dans le fichier
 */
function saveCooldowns() {
  try {
    fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldowns, null, 2));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des cooldowns:', error);
  }
}

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
  saveCooldowns();
}

/**
 * Configure la sauvegarde automatique des cooldowns
 */
function setupAutoSave() {
  setInterval(() => {
    saveCooldowns();
  }, config.storage.autoSaveInterval);
  console.log(`⏱️ Sauvegarde automatique des cooldowns configurée (${config.storage.autoSaveInterval/1000}s)`);
}

// Chargement initial des cooldowns
loadCooldowns();

// Modification: au lieu de configurer ici l'interval
// setInterval(saveCooldowns, config.storage.autoSaveInterval);
// On l'exportera via la fonction setupAutoSave

module.exports = {
  isOnCooldown,
  getRemainingTime,
  setCooldown,
  loadCooldowns,
  setupAutoSave  // Ajout de cette fonction à l'export
};