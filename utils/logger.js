/**
 * Module de journalisation pour le bot
 * Fournit des fonctions pour enregistrer des messages avec différents niveaux de priorité
 */

// Niveaux de journalisation
const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Niveau actuel (peut être modifié via les variables d'environnement)
const currentLevel = process.env.NODE_ENV === 'development' ? levels.DEBUG : levels.INFO;

/**
 * Formate un message de log avec horodatage et niveau
 */
function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
}

/**
 * Journalise une erreur
 */
function error(...args) {
  if (currentLevel >= levels.ERROR) {
    console.error(formatMessage('ERROR', args.join(' ')));
  }
}

/**
 * Journalise un avertissement
 */
function warn(...args) {
  if (currentLevel >= levels.WARN) {
    console.warn(formatMessage('WARN', args.join(' ')));
  }
}

/**
 * Journalise une information
 */
function info(...args) {
  if (currentLevel >= levels.INFO) {
    console.log(formatMessage('INFO', args.join(' ')));
  }
}

/**
 * Journalise un message de débogage
 */
function debug(...args) {
  if (currentLevel >= levels.DEBUG) {
    console.log(formatMessage('DEBUG', args.join(' ')));
  }
}

module.exports = {
  error,
  warn,
  info,
  debug,
  levels
};