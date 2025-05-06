/**
 * Adaptateur d'inventaire pour le bot Twitch
 * 
 * Ce module fait le lien entre le bot Twitch et le système d'inventaire partagé
 */
const path = require('path');
const sharedInventory = require('../../NomadeBot_SHARED/data/inventory');
const logger = require('../utils/logger');

// Initialize the inventory
logger.info('🔄 Initialisation du module d\'inventaire partagé...');
sharedInventory.loadInventories();
sharedInventory.loadLinkedAccounts();

/**
 * Charge les inventaires depuis le système partagé
 */
function loadInventories() {
  return sharedInventory.loadInventories();
}

/**
 * Sauvegarde les inventaires dans le système partagé
 */
function saveInventories() {
  return sharedInventory.saveInventories();
}

/**
 * Ajoute un skin à l'inventaire d'un utilisateur
 */
function addSkinToInventory(userId, skin) {
  return sharedInventory.addItemToInventory(userId, skin, 'twitch');
}

/**
 * Récupère l'inventaire complet d'un utilisateur
 */
function getUserInventory(userId) {
  return sharedInventory.getUserInventory(userId, 'twitch');
}

/**
 * Supprime un skin de l'inventaire d'un utilisateur et le retourne
 */
function removeSkinFromInventory(userId, index) {
  return sharedInventory.removeItemFromInventory(userId, index, 'twitch');
}

/**
 * Configure la sauvegarde automatique des inventaires
 */
function setupAutoSave(interval) {
  sharedInventory.setupAutoSave(interval);
  logger.info(`⏱️ Sauvegarde automatique des inventaires configurée (${interval/1000}s)`);
}

// Export des fonctions avec la même interface que le module original
module.exports = {
  loadInventories,
  saveInventories,
  addSkinToInventory,
  getUserInventory,
  removeSkinFromInventory,
  setupAutoSave,
  getAllInventories: () => sharedInventory.getAllInventories()
};