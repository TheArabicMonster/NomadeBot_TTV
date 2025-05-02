/**
 * Gestionnaire d'utilisateurs - Gère le mapping entre IDs et noms d'utilisateurs
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Chemin vers le fichier de stockage des utilisateurs
const USER_MAP_FILE = path.join(__dirname, '..', config.storage.files.userMap);

// Cache des utilisateurs (en mémoire)
let userMap = {};

/**
 * Charge le mapping utilisateurs depuis le fichier
 */
function loadUserMap() {
  try {
    if (fs.existsSync(USER_MAP_FILE)) {
      const data = fs.readFileSync(USER_MAP_FILE, 'utf8');
      userMap = JSON.parse(data);
      console.log(`✅ ${Object.keys(userMap).length} utilisateurs chargés`);
    } else {
      userMap = {};
      console.log('⚠️ Aucun fichier de mapping utilisateurs trouvé, création d\'un nouveau.');
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement du mapping utilisateurs:', error);
    userMap = {};
  }
  return userMap;
}

/**
 * Sauvegarde le mapping utilisateurs dans le fichier
 */
function saveUserMap() {
  try {
    fs.writeFileSync(USER_MAP_FILE, JSON.stringify(userMap, null, 2));
    console.log(`✅ Mapping utilisateurs sauvegardé (${Object.keys(userMap).length} utilisateurs)`);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du mapping utilisateurs:', error);
  }
}

/**
 * Enregistre un utilisateur dans le mapping
 */
function recordUser(username, userId) {
  if (username && userId) {
    userMap[userId] = username;
    return true;
  }
  return false;
}

/**
 * Récupère le pseudo d'un utilisateur par son ID
 */
function getUsernameById(userId) {
  return userMap[userId] || `User-${userId.slice(-4)}`;
}

/**
 * Récupère l'ID d'un utilisateur par son pseudo
 */
function findUserIdByUsername(username) {
  if (!username) return null;
  
  const lowercaseUsername = username.toLowerCase();
  for (const [userId, name] of Object.entries(userMap)) {
    if (name.toLowerCase() === lowercaseUsername) {
      return userId;
    }
  }
  return null;
}

/**
 * Configure la sauvegarde automatique du mapping utilisateurs
 */
function setupAutoSave() {
  setInterval(() => {
    saveUserMap();
  }, config.storage.autoSaveInterval);
  console.log(`⏱️ Sauvegarde automatique du mapping utilisateurs configurée (${config.storage.autoSaveInterval/1000}s)`);
}

// Charger le mapping utilisateurs au démarrage
loadUserMap();

module.exports = {
  loadUserMap,
  saveUserMap,
  recordUser,
  getUsernameById,
  findUserIdByUsername,
  setupAutoSave,
  getAllUsers: () => ({ ...userMap })
};