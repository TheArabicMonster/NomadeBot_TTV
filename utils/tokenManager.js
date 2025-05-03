/**
 * Gestionnaire de token OAuth pour Twitch
 * Permet de rafraîchir automatiquement le token avant expiration
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const dotenv = require('dotenv');

// Chemin vers le fichier .env
const envPath = path.join(__dirname, '..', '.env');

/**
 * Vérifie si le token a besoin d'être rafraîchi
 * Note: Twitch ne retourne pas d'information d'expiration dans le token standard,
 * nous allons donc le rafraîchir tous les 30 jours par précaution
 */
function checkTokenExpiry() {
  try {
    // Lire les variables d'environnement actuelles
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // Si TWITCH_TOKEN_DATE n'existe pas, on considère que le token doit être rafraîchi
    if (!envConfig.TWITCH_TOKEN_DATE) {
      logger.info('Date du token manquante, rafraîchissement du token...');
      return refreshToken();
    }
    
    const tokenDate = new Date(envConfig.TWITCH_TOKEN_DATE);
    const now = new Date();
    
    // Calculer la différence en jours
    const diffTime = Math.abs(now - tokenDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Si le token a plus de 30 jours, on le rafraîchit
    if (diffDays >= 30) {
      logger.info(`Token âgé de ${diffDays} jours, rafraîchissement...`);
      return refreshToken();
    }
    
    logger.debug(`Token valide (âge: ${diffDays} jours)`);
    return Promise.resolve();
  } catch (error) {
    logger.error('Erreur lors de la vérification du token:', error);
    return Promise.reject(error);
  }
}

/**
 * Rafraîchit le token OAuth à l'aide du refresh_token
 */
function refreshToken() {
  return new Promise((resolve, reject) => {
    // Vérifier que les variables requises sont définies
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const refreshToken = process.env.TWITCH_REFRESH_TOKEN;
    
    if (!clientId || !clientSecret || !refreshToken) {
      const error = new Error('Variables d\'environnement manquantes pour le rafraîchissement du token');
      logger.error(error.message);
      return reject(error);
    }
    
    const data = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }).toString();
    
    const options = {
      hostname: 'id.twitch.tv',
      port: 443,
      path: '/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          const error = new Error(`Erreur HTTP ${res.statusCode}: ${responseData}`);
          logger.error('Échec du rafraîchissement du token:', error);
          return reject(error);
        }
        
        try {
          const result = JSON.parse(responseData);
          
          // Mettre à jour le fichier .env de manière asynchrone
          updateEnvFile({
            TWITCH_TOKEN: `oauth:${result.access_token}`,
            TWITCH_REFRESH_TOKEN: result.refresh_token,
            TWITCH_TOKEN_DATE: new Date().toISOString()
          })
          .then(() => {
            // Mettre à jour les variables d'environnement
            process.env.TWITCH_TOKEN = `oauth:${result.access_token}`;
            process.env.TWITCH_REFRESH_TOKEN = result.refresh_token;
            
            logger.info('Token Twitch rafraîchi avec succès!');
            resolve();
          })
          .catch(error => {
            logger.error('Erreur lors de la mise à jour du fichier .env:', error);
            reject(error);
          });
        } catch (error) {
          logger.error('Erreur lors du traitement de la réponse:', error);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      logger.error('Erreur lors de la requête HTTP:', error);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

/**
 * Met à jour le fichier .env avec les nouvelles valeurs
 * @param {Object} newValues - Objet contenant les clés et valeurs à mettre à jour
 * @returns {Promise<void>} - Promise résolue quand la mise à jour est terminée
 */
function updateEnvFile(newValues) {
  return new Promise((resolve, reject) => {
    try {
      // Vérifier que newValues est un objet valide
      if (!newValues || typeof newValues !== 'object' || Array.isArray(newValues)) {
        throw new Error('Les nouvelles valeurs doivent être un objet');
      }
      
      // Vérifier que le fichier .env existe, sinon le créer
      if (!fs.existsSync(envPath)) {
        logger.warn('Fichier .env non trouvé, création d\'un nouveau fichier');
        fs.writeFileSync(envPath, '');
      }
      
      // Lire le fichier .env actuel
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Traiter chaque valeur
      Object.entries(newValues).forEach(([key, value]) => {
        // Échapper les caractères spéciaux dans la valeur
        const safeValue = String(value).replace(/\n/g, '\\n').replace(/"/g, '\\"');
        
        // Si la clé existe déjà, on la met à jour
        const regex = new RegExp(`^${key}=.*$`, 'gm');
        
        if (regex.test(envContent)) {
          // Mettre à jour la valeur existante
          envContent = envContent.replace(regex, `${key}=${safeValue}`);
        } else {
          // Ajouter la nouvelle valeur à la fin du fichier
          const newLine = envContent.endsWith('\n') ? '' : '\n';
          envContent += `${newLine}${key}=${safeValue}`;
        }
      });
      
      // Utiliser writeFile asynchrone pour éviter de bloquer le thread principal
      fs.writeFile(envPath, envContent, 'utf8', (err) => {
        if (err) {
          logger.error('Erreur lors de l\'écriture du fichier .env:', err);
          reject(err);
        } else {
          logger.debug('Fichier .env mis à jour avec les nouveaux tokens');
          resolve();
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du fichier .env:', error);
      reject(error);
    }
  });
}

/**
 * Récupère la valeur actuelle d'un token depuis le fichier .env
 * @param {string} tokenName - Nom du token à récupérer
 * @returns {string|null} - Valeur du token ou null si non trouvé
 */
function getTokenValue(tokenName) {
  try {
    if (!fs.existsSync(envPath)) {
      return null;
    }
    
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    return envConfig[tokenName] || null;
  } catch (error) {
    logger.error(`Erreur lors de la récupération du token ${tokenName}:`, error);
    return null;
  }
}

/**
 * Configure la vérification périodique du token
 * @param {number} interval - Intervalle en millisecondes (par défaut: 24h)
 */
function setupTokenCheck(interval = 24 * 60 * 60 * 1000) {
  // Vérifier le token au démarrage
  checkTokenExpiry().catch(err => {
    logger.warn('Échec de la vérification initiale du token, nouvelle tentative prévue');
  });
  
  // Configurer la vérification périodique
  setInterval(() => {
    checkTokenExpiry().catch(err => {
      logger.warn('Échec de la vérification périodique du token');
    });
  }, interval);
  
  logger.info(`Vérification du token configurée (intervalle: ${interval / (60 * 60 * 1000)}h)`);
}

module.exports = {
  checkTokenExpiry,
  refreshToken,
  setupTokenCheck
};