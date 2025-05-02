/**
 * Utilitaire de journalisation pour le bot
 * Permet de centraliser les logs avec différents niveaux (info, warning, error)
 */
const fs = require('fs');
const path = require('path');

// Configuration du logger
const config = {
  // Activer/désactiver les logs dans la console
  console: true,
  // Activer/désactiver les logs dans un fichier
  file: true,
  // Chemin du fichier de logs
  logFilePath: path.join(__dirname, '..', 'logs', 'bot.log'),
  // Niveau minimum de log (debug, info, warn, error)
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  // Format de la date pour les logs
  dateFormat: { 
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
};

// S'assurer que le répertoire de logs existe
if (config.file) {
  const logDir = path.dirname(config.logFilePath);
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (error) {
      console.error('Impossible de créer le répertoire de logs:', error);
      config.file = false;
    }
  }
}

/**
 * Niveaux de log avec leurs couleurs et priorités
 */
const levels = {
  debug: { color: '\x1b[36m', priority: 0 },  // Cyan
  info: { color: '\x1b[32m', priority: 1 },   // Vert
  warn: { color: '\x1b[33m', priority: 2 },   // Jaune
  error: { color: '\x1b[31m', priority: 3 }   // Rouge
};

/**
 * Formatte un message de log avec la date et le niveau
 */
function formatLogMessage(level, message) {
  const timestamp = new Date().toLocaleString('fr-FR', config.dateFormat);
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
}

/**
 * Écrit un message dans le fichier de log
 */
function writeToFile(formattedMessage) {
  if (!config.file) return;
  
  try {
    fs.appendFileSync(config.logFilePath, formattedMessage + '\n');
  } catch (error) {
    console.error('Erreur lors de l\'écriture dans le fichier de logs:', error);
    config.file = false;
  }
}

/**
 * Crée les fonctions de log pour chaque niveau
 */
const logger = {};

for (const [levelName, levelData] of Object.entries(levels)) {
  logger[levelName] = function(message, ...args) {
    // Vérifier si ce niveau doit être journalisé
    if (levelData.priority < levels[config.level].priority) return;
    
    // Formater le message
    let finalMessage = message;
    if (args.length > 0) {
      try {
        finalMessage = message.replace(/{(\d+)}/g, (match, number) => {
          return typeof args[number] !== 'undefined' ? args[number] : match;
        });
      } catch (error) {
        finalMessage = `${message} ${args.join(' ')}`;
      }
    }
    
    const formattedMessage = formatLogMessage(levelName, finalMessage);
    
    // Afficher dans la console
    if (config.console) {
      const resetColor = '\x1b[0m';
      console.log(`${levelData.color}${formattedMessage}${resetColor}`);
    }
    
    // Écrire dans le fichier
    writeToFile(formattedMessage);
  };
}

module.exports = logger;