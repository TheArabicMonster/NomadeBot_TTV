/**
 * Point d'entrée principal du bot Twitch
 * Initialise la connexion et configure les événements
 */
require('dotenv').config();
const tmi = require('tmi.js');
const config = require('./config/config');
const commandHandler = require('./commands');
const logger = require('./utils/logger');
const messages = require('./config/messages');
const inventory = require('./data/inventory');
const cooldowns = require('./data/cooldowns');
const users = require('./data/users');
const tokenManager = require('./utils/tokenManager'); // Ajouter cette ligne

// Vérifier les variables d'environnement requises
const requiredEnvVars = ['TWITCH_BOT_USERNAME', 'TWITCH_TOKEN', 'TWITCH_CHANNEL', 
                         'TWITCH_CLIENT_ID', 'TWITCH_CLIENT_SECRET', 'TWITCH_REFRESH_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`La variable d'environnement ${envVar} est manquante!`);
    process.exit(1);
  }
}

// Configurer la vérification du token (toutes les 24h)
tokenManager.setupTokenCheck();

// Configuration du client Twitch
const client = new tmi.Client({
  options: { debug: config.debug },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_TOKEN,
  },
  channels: [process.env.TWITCH_CHANNEL],
});

// Connexion au serveur Twitch
client
  .connect()
  .then(() => logger.info('✅ Bot connecté à Twitch'))
  .catch((err) => logger.error('❌ Erreur de connexion à Twitch:', err));

// Événement: Connexion établie
client.on('connected', () => {
  logger.info(`Bot connecté à Twitch en tant que ${process.env.TWITCH_BOT_USERNAME}`);
  logger.info(`Canal: ${process.env.TWITCH_CHANNEL}`);
  
  // Démarrer les messages périodiques après un délai
  setTimeout(() => {
    logger.info('Démarrage des messages périodiques');
    messages.startPeriodicMessages(client, process.env.TWITCH_CHANNEL);
  }, config.periodicMessages.initialDelay);
});

// Événement: Réception des messages
client.on('message', (channel, userstate, message, self) => {
  // Ignorer les messages du bot - Correction de la vérification
  if (self || userstate.username.toLowerCase() === process.env.TWITCH_BOT_USERNAME.toLowerCase()) {
    logger.debug(`Message ignoré (bot): ${message}`);
    return;
  }
  
  // Enregistrer l'utilisateur
  users.recordUser(userstate.username, userstate['user-id']);
  
  // Traiter les commandes
  if (message.startsWith(config.commands.prefix)) {
    logger.debug(`Commande reçue de ${userstate.username}: ${message}`);
    commandHandler.processCommand(client, channel, userstate, message);
  }
});

// Événement: Reconnexion
client.on('reconnect', () => {
  logger.warn('Reconnexion à Twitch...');
});

// Événement: Déconnexion
client.on('disconnected', (reason) => {
  logger.warn(`Déconnecté de Twitch: ${reason}`);
});

// Configuration des sauvegardes automatiques des données
inventory.setupAutoSave();
// cooldowns.setupAutoSave();
console.log('⏱️ Système de cooldown en mémoire configuré');
users.setupAutoSave();

// Intercepter les erreurs non gérées
process.on('uncaughtException', (error) => {
  logger.error('Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesse rejetée non gérée:', reason);
});

logger.info('Bot Twitch démarré avec succès');