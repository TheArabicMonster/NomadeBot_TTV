/**
 * Gestionnaire des utilisateurs - Stocke les informations sur les utilisateurs
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Chemin vers le fichier de mapping des utilisateurs
// Utiliser le nom du fichier depuis la config mais s'assurer qu'il est bien dans le dossier config
const USER_MAP_FILE = path.join(__dirname, '..', 'config', config.storage.files.userMap);

// Cache des utilisateurs (en mémoire)
let userMapping = {};

/**
 * Charge les mappings d'utilisateurs depuis le fichier
 */
function loadUserMapping() {
  try {
    // Vérifier d'abord si le fichier existe dans le dossier config
    if (fs.existsSync(USER_MAP_FILE)) {
      const data = fs.readFileSync(USER_MAP_FILE, 'utf8');
      userMapping = JSON.parse(data);
      console.log(`✅ Mapping d'utilisateurs chargé pour ${Object.keys(userMapping).length} utilisateurs`);
    } 
    // Vérifier si un ancien fichier existe à la racine (pour rétrocompatibilité)
    else if (fs.existsSync(path.join(__dirname, '..', config.storage.files.userMap))) {
      console.log('⚠️ Fichier user_map trouvé à la racine, déplacement vers le dossier config...');
      const data = fs.readFileSync(path.join(__dirname, '..', config.storage.files.userMap), 'utf8');
      userMapping = JSON.parse(data);
      
      // Enregistrer le fichier au bon endroit
      try {
        fs.writeFileSync(USER_MAP_FILE, JSON.stringify(userMapping, null, 2));
        // Supprimer l'ancien fichier
        fs.unlinkSync(path.join(__dirname, '..', config.storage.files.userMap));
        console.log('✅ Fichier déplacé avec succès');
      } catch (moveError) {
        console.error('❌ Erreur lors du déplacement du fichier:', moveError);
      }
    }
    else {
      userMapping = {};
      console.log('⚠️ Aucun fichier de mapping utilisateurs trouvé, création d\'un nouveau.');
      
      // S'assurer que le dossier config existe
      const configDir = path.join(__dirname, '..', 'config');
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
        console.log('📁 Dossier config créé');
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement du mapping utilisateurs:', error);
    userMapping = {};
  }
  return userMapping;
}

/**
 * Sauvegarde le mapping d'utilisateurs dans le fichier
 */
function saveUserMapping() {
  try {
    fs.writeFileSync(USER_MAP_FILE, JSON.stringify(userMapping, null, 2));
    console.log(`✅ Mapping d'utilisateurs sauvegardé pour ${Object.keys(userMapping).length} utilisateurs`);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du mapping utilisateurs:', error);
  }
}

/**
 * Enregistre un utilisateur ou met à jour son nom
 */
function recordUser(username, userId) {
  if (!userId || !username) return false;
  
  // Mettre à jour ou ajouter l'utilisateur
  userMapping[userId] = username;
  return true;
}

/**
 * Récupère le nom d'utilisateur par ID
 */
function getUsernameById(userId) {
  return userMapping[userId] || `User-${userId.slice(-4)}`;
}

/**
 * Configure la sauvegarde automatique des données utilisateurs
 */
function setupAutoSave() {
  setInterval(() => {
    saveUserMapping();
  }, config.storage.autoSaveInterval);
  console.log(`⏱️ Sauvegarde automatique du mapping utilisateurs configurée (${config.storage.autoSaveInterval/1000}s)`);
}

// Charger le mapping au démarrage
loadUserMapping();

module.exports = {
  recordUser,
  getUsernameById,
  saveUserMapping,
  loadUserMapping,
  setupAutoSave
};