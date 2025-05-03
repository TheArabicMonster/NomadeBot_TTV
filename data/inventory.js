/**
 * Gestionnaire d'inventaires - Gère les inventaires des utilisateurs
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Chemin vers le fichier de stockage des inventaires dans data/static/
const INVENTORY_FILE = path.join(__dirname, 'static', config.storage.files.inventory);
// Ancien chemin pour la migration
const OLD_INVENTORY_FILE = path.join(__dirname, '..', config.storage.files.inventory);
// Autre chemin possible (config/)
const CONFIG_INVENTORY_FILE = path.join(__dirname, '..', 'config', config.storage.files.inventory);

// Cache des inventaires (en mémoire)
let userInventories = {};

/**
 * Charge les inventaires depuis le fichier
 */
function loadInventories() {
  try {
    // Vérifier d'abord si le fichier existe dans data/static/
    if (fs.existsSync(INVENTORY_FILE)) {
      const data = fs.readFileSync(INVENTORY_FILE, 'utf8');
      userInventories = JSON.parse(data);
      console.log(`✅ ${Object.keys(userInventories).length} inventaires chargés depuis data/static/`);
    } 
    // Vérifier ensuite si le fichier existe dans le dossier config
    else if (fs.existsSync(CONFIG_INVENTORY_FILE)) {
      console.log('⚠️ Fichier d\'inventaires trouvé dans config/, déplacement vers data/static/...');
      const data = fs.readFileSync(CONFIG_INVENTORY_FILE, 'utf8');
      userInventories = JSON.parse(data);
      
      // S'assurer que le dossier data/static/ existe
      const staticDir = path.join(__dirname, 'static');
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
        console.log('📁 Dossier data/static/ créé');
      }

      // Sauvegarder au nouvel emplacement
      fs.writeFileSync(INVENTORY_FILE, JSON.stringify(userInventories, null, 2));
      
      // Supprimer l'ancien fichier
      fs.unlinkSync(CONFIG_INVENTORY_FILE);
      console.log('✅ Fichier d\'inventaires déplacé avec succès');
    }
    // Vérifier si un fichier existe à la racine
    else if (fs.existsSync(OLD_INVENTORY_FILE)) {
      console.log('⚠️ Fichier d\'inventaires trouvé à la racine, déplacement vers data/static/...');
      const data = fs.readFileSync(OLD_INVENTORY_FILE, 'utf8');
      userInventories = JSON.parse(data);
      
      // S'assurer que le dossier data/static/ existe
      const staticDir = path.join(__dirname, 'static');
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
        console.log('📁 Dossier data/static/ créé');
      }

      // Sauvegarder au nouvel emplacement
      fs.writeFileSync(INVENTORY_FILE, JSON.stringify(userInventories, null, 2));
      
      // Supprimer l'ancien fichier
      fs.unlinkSync(OLD_INVENTORY_FILE);
      console.log('✅ Fichier d\'inventaires déplacé avec succès');
    }
    else {
      userInventories = {};
      console.log('⚠️ Aucun fichier d\'inventaires trouvé, création d\'un nouveau dans data/static/');
      
      // S'assurer que le dossier data/static/ existe
      const staticDir = path.join(__dirname, 'static');
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
        console.log('📁 Dossier data/static/ créé');
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des inventaires:', error);
    userInventories = {};
  }
  return userInventories;
}

/**
 * Sauvegarde les inventaires dans le fichier
 */
function saveInventories() {
  try {
    // S'assurer que le dossier data/static/ existe
    const staticDir = path.join(__dirname, 'static');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(userInventories, null, 2));
    console.log(`✅ Inventaires sauvegardés pour ${Object.keys(userInventories).length} utilisateurs`);
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des inventaires:', error);
  }
}

/**
 * Ajoute un skin à l'inventaire d'un utilisateur
 */
function addSkinToInventory(userId, skin) {
  // Initialiser l'inventaire si nécessaire
  if (!userInventories[userId]) {
    userInventories[userId] = [];
  }
  
  // Ajouter le skin et sauvegarder
  userInventories[userId].push(skin);
  return true;
}

/**
 * Récupère l'inventaire complet d'un utilisateur
 */
function getUserInventory(userId) {
  return userInventories[userId] || [];
}

/**
 * Supprime un skin de l'inventaire d'un utilisateur et le retourne
 */
function removeSkinFromInventory(userId, index) {
  if (!userInventories[userId] || index < 0 || index >= userInventories[userId].length) {
    return null;
  }
  
  return userInventories[userId].splice(index, 1)[0];
}

/**
 * Configure la sauvegarde automatique des inventaires
 */
function setupAutoSave() {
  setInterval(() => {
    saveInventories();
  }, config.storage.autoSaveInterval);
  console.log(`⏱️ Sauvegarde automatique des inventaires configurée (${config.storage.autoSaveInterval/1000}s)`);
}

// Charger les inventaires au démarrage
loadInventories();

module.exports = {
  loadInventories,
  saveInventories,
  addSkinToInventory,
  getUserInventory,
  removeSkinFromInventory,
  setupAutoSave,
  getAllInventories: () => userInventories
};