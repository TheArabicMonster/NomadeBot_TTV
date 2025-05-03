/**
 * Module de gestion de file d'attente de messages
 * Permet d'envoyer des messages en respectant les limites de taux de Twitch
 */
const logger = require('./logger');

// Configuration de la file d'attente
const DELAY_BETWEEN_MESSAGES = 1500; // 1.5 secondes entre les messages

// File d'attente de messages
const messageQueue = [];
let isProcessing = false;

/**
 * Ajoute un message à la file d'attente et démarre le traitement si nécessaire
 */
function enqueue(client, channel, message) {
  messageQueue.push({ client, channel, message });
  logger.debug(`Message ajouté à la file d'attente: ${message}`);
  
  if (!isProcessing) {
    processQueue();
  }
}

/**
 * Traite les messages dans la file d'attente
 */
function processQueue() {
  if (messageQueue.length === 0) {
    isProcessing = false;
    return;
  }
  
  isProcessing = true;
  const { client, channel, message } = messageQueue.shift();
  
  try {
    client.say(channel, message)
      .then(() => {
        logger.debug(`Message envoyé: ${message}`);
      })
      .catch(error => {
        logger.error(`Erreur lors de l'envoi du message: ${error.message}`);
      });
  } catch (error) {
    logger.error(`Exception lors de l'envoi du message: ${error.message}`);
  }
  
  // Traiter le message suivant après le délai
  setTimeout(processQueue, DELAY_BETWEEN_MESSAGES);
}

module.exports = {
  enqueue
};
