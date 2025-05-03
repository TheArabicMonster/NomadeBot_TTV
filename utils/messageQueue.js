/**
 * Module de gestion de file d'attente de messages
 * Permet d'envoyer des messages en respectant les limites de taux de Twitch
 */
const logger = require('./logger');

// Configuration de la file d'attente
const DELAY_BETWEEN_MESSAGES = 1500; // 1.5 secondes entre les messages
const DELAY_BETWEEN_WHISPERS = 3000; // 3 secondes entre les whispers (plus restrictif)

// File d'attente de messages
const messageQueue = [];
const whisperQueue = []; // Nouvelle file pour les whispers
let isProcessing = false;
let isProcessingWhispers = false; // Nouvel état pour les whispers

/**
 * Ajoute un message à la file d'attente et démarre le traitement si nécessaire
 */
function enqueue(client, channel, message) {
  messageQueue.push({ client, channel, message });
  logger.debug(`Message ajouté à la file d'attente: ${message}`);
  
  if (!isProcessing) {
    isProcessing = true;
    processQueue();
  }
}

/**
 * Ajoute un whisper à la file d'attente et démarre le traitement si nécessaire
 */
function enqueueWhisper(client, username, message) {
  whisperQueue.push({ client, username, message });
  if (!isProcessingWhispers) {
    isProcessingWhispers = true;
    processWhisperQueue();
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
  
  const { client, channel, message } = messageQueue.shift();
  
  try {
    client.say(channel, message);
    logger.debug(`Message envoyé à ${channel}: ${message}`);
  } catch (error) {
    logger.error(`Erreur lors de l'envoi du message: ${error.message}`);
  }
  
  // Programmer le traitement du prochain message
  setTimeout(processQueue, DELAY_BETWEEN_MESSAGES);
}

/**
 * Traite les whispers dans la file d'attente
 */
function processWhisperQueue() {
  if (whisperQueue.length === 0) {
    isProcessingWhispers = false;
    return;
  }
  
  const { client, username, message } = whisperQueue.shift();
  
  try {
    client.whisper(username, message);
    logger.debug(`Whisper envoyé à ${username}: ${message}`);
  } catch (error) {
    logger.error(`Erreur lors de l'envoi du whisper: ${error.message}`);
  }
  
  // Programmer le traitement du prochain whisper
  setTimeout(processWhisperQueue, DELAY_BETWEEN_WHISPERS);
}

module.exports = {
  enqueue,
  enqueueWhisper
};
