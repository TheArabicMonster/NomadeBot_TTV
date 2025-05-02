/**
 * Fonctions utilitaires diverses pour le bot
 * Regroupe des helpers génériques utilisés dans différentes parties du bot
 */

/**
 * Renvoie un élément aléatoire d'un tableau
 */
function randomFromArray(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Renvoie un nombre aléatoire entre min et max (inclus)
 */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formate une durée en millisecondes en texte lisible
 * Ex: 65000 -> "1 minute et 5 secondes"
 */
function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  
  if (days > 0) {
    parts.push(`${days} jour${days > 1 ? 's' : ''}`);
  }
  
  if (hours > 0) {
    parts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  
  if (seconds > 0 && days === 0) { // N'affiche les secondes que si moins d'un jour
    parts.push(`${seconds} seconde${seconds > 1 ? 's' : ''}`);
  }
  
  if (parts.length === 0) {
    return 'moins d\'une seconde';
  }
  
  if (parts.length === 1) {
    return parts[0];
  }
  
  const lastPart = parts.pop();
  return `${parts.join(', ')} et ${lastPart}`;
}

/**
 * Formate le temps restant jusqu'à une date donnée
 */
function formatTimeRemaining(targetDate) {
  const now = Date.now();
  const remaining = targetDate - now;
  
  if (remaining <= 0) {
    return 'maintenant';
  }
  
  return formatDuration(remaining);
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Limite la taille d'une chaîne et ajoute "..." si nécessaire
 */
function truncateString(str, maxLength) {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
}

/**
 * Mélange un tableau (méthode Fisher-Yates)
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Attend un certain temps (en millisecondes)
 * À utiliser avec async/await
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Crée un délai d'expiration pour une Promise
 * @returns {Promise} Rejette avec erreur si le délai est dépassé
 */
function timeout(promise, ms, errorMessage = 'Délai d\'attente dépassé') {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(errorMessage)), ms)
    )
  ]);
}

/**
 * Vérifie si une chaîne est un JSON valide
 */
function isValidJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  randomFromArray,
  randomBetween,
  formatDuration,
  formatTimeRemaining,
  formatNumber,
  truncateString,
  shuffleArray,
  sleep,
  timeout,
  isValidJson
};