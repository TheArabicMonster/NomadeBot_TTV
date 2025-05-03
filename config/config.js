/**
 * Configuration globale du bot
 * Contient tous les paramètres configurables
 */

module.exports = {
  // Cooldowns des commandes en millisecondes
  cooldowns: {
    knife: 5 * 60 * 1000,      // 5 minutes
    skin: 5 * 60 * 1000,       // 5 minutes pour la commande skin
    daily: 24 * 60 * 60 * 1000 // 24 heures
  },
  
  // Durées des animations
  animations: {
    knife: 5000  // Durée de l'animation lors d'un drop rare (5 secondes)
  },
  
  // Configuration des messages périodiques
  periodicMessages: {
    initialDelay: 30000,       // 30 secondes avant le premier message
    minInterval: 15 * 60 * 1000, // 15 minutes minimum entre messages
    maxInterval: 30 * 60 * 1000  // 30 minutes maximum entre messages
  },
  
  // Paramètres pour les commandes
  commands: {
    prefix: '!',               // Préfixe des commandes
    caseSensitive: false       // Les commandes ne sont pas sensibles à la casse
  },
  
  // Paramètres de sauvegarde
  storage: {
    autoSaveInterval: 5 * 60 * 1000, // Sauvegarde auto toutes les 5 minutes
    files: {
      inventory: 'inventaires.json',
      cooldowns: 'cooldowns.json',
      userMap: 'user_map.json'
    }
  },
  
  // Paramètres d'affichage
  display: {
    maxResultsPerList: 5,      // Nombre max d'éléments à afficher pour les listes
    inventoryPageSize: 10      // Nombre d'éléments par page d'inventaire
  },
  
  // Mode développement
  debug: process.env.NODE_ENV === 'development'
};