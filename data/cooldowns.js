/**
 * Gestionnaire de cooldowns - Gère les délais entre les commandes
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Chemin vers le fichier de stockage des cooldowns
const COOLDOWN_FILE = path.join(__dirname, '..', config.storage.files.cooldowns);

// Cache des cooldowns (en mémoire)
let userCooldowns = {};

/**
 * Charge les cooldowns depuis le fichier
 */
function loadCooldowns() {
  try {
    if (fs.existsSync(COOLDOWN_FILE)) {
      const data = fs.readFileSync(COOLDOWN_FILE, 'utf8');
      userCooldowns = JSON.parse(data);
      console.log('✅ Cooldowns chargés');
    } else {
      userCooldowns = {};
      console.log('⚠️ Aucun fichier de cooldowns trouvé, création d\'un nouveau.');
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des cooldowns:', error);
    userCooldowns = {};
  }
  return userCooldowns;
}

/**
 * Sauvegarde les cooldowns dans le fichier
 */
function saveCooldowns() {
  try {
    fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(userCooldowns, null, 2));
    console.log('✅ Cooldowns sauvegardés');
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des cooldowns:', error);
  }
}

/**
 * Vérifie si un utilisateur est en cooldown pour une commande
 */
function isOnCooldown(userId, commandName) {
  if (!userCooldowns[userId]) return false;
  if (!userCooldowns[userId][commandName]) return false;
  
  const cooldownEnd = userCooldowns[userId][commandName];
  return Date.now() < cooldownEnd;
}

/**
 * Définit un cooldown pour un utilisateur et une commande
 */
function setCooldown(userId, commandName) {
  if (!userCooldowns[userId]) {
    userCooldowns[userId] = {};
  }
  
  userCooldowns[userId][commandName] = Date.now() + config.cooldowns[commandName];
  return true;
}

/**
 * Récupère le temps restant de cooldown (en minutes)
 */
function getRemainingTime(userId, commandName) {
  if (!isOnCooldown(userId, commandName)) return 0;
  
  const cooldownEnd = userCooldowns[userId][commandName];
  const remainingMs = cooldownEnd - Date.now();
  return Math.ceil(remainingMs / (60 * 1000)); // Conversion en minutes
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

// Charger les cooldowns au démarrage
loadCooldowns();

module.exports = {
  loadCooldowns,
  saveCooldowns,
  isOnCooldown,
  setCooldown,
  getRemainingTime,
  setupAutoSave,
  resetCooldown: (userId, commandName) => {
    if (userCooldowns[userId]) delete userCooldowns[userId][commandName];
  }
};