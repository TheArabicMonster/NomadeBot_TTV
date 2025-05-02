require("dotenv").config(); 

const tmi = require("tmi.js");
const fs = require("fs");
const path = require("path");
const knives = require('./knives.js');
const rarities = require('./rarities.js');
const skins = require('./knives.js'); 

const TOKEN = process.env.TWITCH_TOKEN;
const CHANNEL = process.env.TWITCH_CHANNEL;

// Définition des noms de commandes 
const CMD = {
  HELP: "help",
  COMMANDES: "commandes",
  HELLO: "hello",
  DICE: "dice",
  INFO: "info",
  KNIFE: "knife",
  INVENTAIRE: "inventaire",
  STATS: "stats",
  TOP: "top",
  LEADERBOARD: "leaderboard",
  CHANCE: "chance",
  GIFT: "gift",
  SEARCH: "search"
};

// Liste des messages périodiques
const periodicMessages = [
  "👆 Cette personne est de mèche 🤝 avec Xi Jinping 🐉 ☝️",
  "👆 Cet utilisateur soutient 🗳️ le PCC 🇨🇳 ☝️🤔",
  "👆 ⚠️ Soupçonné de trahison 🤫 envers l'humanité 🌍 ⚠️ ☝️",
  "👆 🤡 Candidat officiel 🎖️ pour les Darwin Awards 💥 ☝️🏆",
  "👆 💀 A vendu son âme 🧾 pour quelques skins CS:GO 🔪 ☝️💰",
  "👆 🧠 A un QI négatif 📉 confirmé scientifiquement 🔬 ☝️",
  "👆 🚨 Recherché par Interpol 🕵️ pour crimes contre l'humanité 🎨 ☝️",
  "👆 🥶 Joue encore à CS:GO en 640x480 🖥️ pour 'meilleure perf' 💾 ☝️",
  "👆 🦀 A remplacé l’eau 💧 par du Monster Energy ⚡ ☝️🥤",
  "👆 🐢 Joue avec un PC 💻 de 2007 📦 et ça se voit 👓 ☝️⌛",
  "👆 🧂 Se fait mute 🔇 en 2 rounds 🕒 pour toxicité ☝️💢",
  "👆 🐄 Utilise encore Teamspeak en BIG 2025 ☝️📻",
  "👆 a déjà bark en vocal pour un knife ☝️🐕",
  "👆 🏳️‍🌈 Dans la rue on le confond 🧍 avec un femboy 💅 ☝️✨",
  "👆 🧠 Se prend pour Aizen Prime 🧥 mais fait encore pipi au lit 🛏️ ☝️",
  "👆 🎤 A déjà assisté 📚 à une conférence de Oussama Ammar 💼 ☝️📢",
  "👆 👔 CEO de la team 21 🕹️ ☝️👑",
  "👆 🐶 Bark en DM 📩 pour sa e-girl ☝️",
  "👆 🍕 A un régime alimentaire plus choquant 😨 que celui d'Hchizen ☝️🤢",
  "👆 Son QI est plus bas 📉 que son ping 📶 en pleine game 🚨☝️"
];


// Stockage des inventaires et des cooldowns
const INVENTAIRE_FILE = path.join(__dirname, "inventaires.json");
const COOLDOWN_FILE = path.join(__dirname, "cooldowns.json");

// Ajouter cette variable en haut du fichier, après les autres variables globales
let animationEnCours = false;
let animationDuration = 5000; // Durée de l'animation en millisecondes (5 secondes)

// Fonction pour charger les données existantes
function loadData() {
  try {
    // Charger les inventaires s'ils existent
    if (fs.existsSync(INVENTAIRE_FILE)) {
      const inventaireData = fs.readFileSync(INVENTAIRE_FILE, "utf8");
      return JSON.parse(inventaireData);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des inventaires:", error);
  }
  return {}; // Retourne un objet vide si le fichier n'existe pas
}

// Fonction pour sauvegarder les inventaires
function saveInventaires() {
  try {
    fs.writeFileSync(INVENTAIRE_FILE, JSON.stringify(userInventaires, null, 2));
    console.log("✅ Inventaires sauvegardés");
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des inventaires:", error);
  }
}

// Fonction pour sauvegarder les cooldowns
function saveCooldowns() {
  try {
    fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(userCooldowns, null, 2));
    console.log("✅ Cooldowns sauvegardés");
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des cooldowns:", error);
  }
}

// Ajouter cette fonction utilitaire après les autres fonctions de sauvegarde
function saveUserMapping(username, userId) {
  const USER_MAP_FILE = path.join(__dirname, "user_map.json");
  let userMap = {};
  
  try {
    if (fs.existsSync(USER_MAP_FILE)) {
      userMap = JSON.parse(fs.readFileSync(USER_MAP_FILE, "utf8"));
    }
    
    userMap[userId] = username; // Stocker par ID -> username (clé: ID, valeur: pseudo)
    
    fs.writeFileSync(USER_MAP_FILE, JSON.stringify(userMap, null, 2));
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde du mapping utilisateurs:", error);
  }
}

// Fonction pour récupérer un pseudo par ID
function getUsernameById(userId) {
  const USER_MAP_FILE = path.join(__dirname, "user_map.json");
  try {
    if (fs.existsSync(USER_MAP_FILE)) {
      const userMap = JSON.parse(fs.readFileSync(USER_MAP_FILE, "utf8"));
      return userMap[userId] || `User-${userId.slice(-4)}`;
    }
  } catch (error) {
    console.error("❌ Erreur lors de la lecture du mapping utilisateurs:", error);
  }
  return `User-${userId.slice(-4)}`; // Fallback au format actuel
}

// Charger les données au démarrage
const userInventaires = loadData();

// Initialisation des cooldowns
let userCooldowns = {};
try {
  if (fs.existsSync(COOLDOWN_FILE)) {
    const cooldownData = fs.readFileSync(COOLDOWN_FILE, "utf8");
    userCooldowns = JSON.parse(cooldownData);
  }
} catch (error) {
  console.error("Erreur lors du chargement des cooldowns:", error);
}

// Configuration du client
const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_TOKEN,
  },
  channels: [CHANNEL],
});

// Connexion au serveur Twitch
client
  .connect()
  .then(() => console.log("✅ Connecté à Twitch"))
  .catch((err) => console.error("❌ Erreur de connexion:", err));

// Fonction pour envoyer un message périodique
function sendPeriodicMessage() {
  // Envoyer un message aléatoire
  const randomIndex = Math.floor(Math.random() * periodicMessages.length);
  const randomMessage = periodicMessages[randomIndex];
  client.say(CHANNEL, randomMessage);
  console.log(`Message envoyé: ${randomMessage}`);

  // Calcule un délai aléatoire entre 5 et 15 minutes (en millisecondes)
  const minDelay = 5 * 60 * 1000; // 5 minutes
  const maxDelay = 15 * 60 * 1000; // 15 minutes
  const randomDelay = minDelay + Math.random() * (maxDelay - minDelay);

  // Programme le prochain message
  console.log(
    `Prochain message prévu dans ${Math.round(randomDelay / 1000 / 60)} minutes`
  );
  setTimeout(sendPeriodicMessage, randomDelay);
}

// Démarre la séquence de messages après connexion
client.on("connected", (address, port) => {
  console.log(`Bot connecté à ${address}:${port}`);

  // Attend 30 secondes avant de commencer à envoyer des messages périodiques
  // pour s'assurer que la connexion est stable
  setTimeout(() => {
    console.log("Démarrage des messages périodiques");
    sendPeriodicMessage();
  }, 30000);
});

// Sauvegarde automatique toutes les 5 minutes
setInterval(() => {
  saveInventaires();
  saveCooldowns();
}, 5 * 60 * 1000);

// Événement de réception des messages
client.on("message", (channel, userstate, message, self) => {
  // Ignorer les messages du bot
  if (self) return;

  // Afficher le message reçu
  console.log(`${userstate.username} a dit : ${message}`);

  // Ajouter cette ligne après la ligne "console.log(`${userstate.username} a dit : ${message}`);"
  saveUserMapping(userstate.username, userstate["user-id"]);

  // Gestion des commandes
  if (message.startsWith("!")) {
    const command = message.split(" ")[0].substring(1).toLowerCase();

    // Commande !commandes / !help
    if (command === CMD.COMMANDES || command === CMD.HELP) {
      client.say(
        channel,
        `Voici les commandes disponibles : !${CMD.HELLO}, !${CMD.DICE}, !${CMD.INFO}, !${CMD.KNIFE}, !${CMD.INVENTAIRE}, !${CMD.STATS}, !${CMD.TOP}, !${CMD.CHANCE}, !${CMD.GIFT} <utilisateur> <numéro>, !${CMD.SEARCH} <terme>`
      );
    }

    // Commande !hello
    if (command === CMD.HELLO) {
      client.say(
        channel,
        `👋 Salut ${userstate.username} ! Bienvenue dans le chat !`
      );
    }

    // Commande !dice
    if (command === CMD.DICE) {
      const number = Math.floor(Math.random() * 6) + 1;
      client.say(
        channel,
        `${userstate.username} a lancé un dé et a obtenu ${number} !`
      );
    }

    // Commande !info
    if (command === CMD.INFO) {
      client.say(
        channel,
        `Ce bot a été créé avec tmi.js en JavaScript! Utilisez !hello ou !dice pour interagir.`
      );
    }

    // Nouvelle commande: !knife (anciennement !caseopener)
    if (command === CMD.KNIFE) {
      const userId = userstate["user-id"];
      const currentTime = Date.now();
      const cooldownTime = 5 * 60 * 1000; // 5 minutes en millisecondes

      // Vérifier si une animation est en cours
      if (animationEnCours) {
        client.say(
          channel,
          `@${userstate.username}, une animation est en cours! Attends qu'elle se termine avant d'ouvrir une caisse.`
        );
        return;
      }

      // Vérifier le cooldown
      if (
        userCooldowns[userId] &&
        currentTime - userCooldowns[userId] < cooldownTime
      ) {
        const remainingTime = Math.ceil(
          (userCooldowns[userId] + cooldownTime - currentTime) / 1000 / 60
        );
        client.say(
          channel,
          `@${userstate.username}, tu dois attendre encore ${remainingTime} minute(s) avant de pouvoir ouvrir une nouvelle caisse.`
        );
        return;
      }

      // Mettre à jour le cooldown
      userCooldowns[userId] = currentTime;

      // Nouvelle logique basée sur la rareté
      const roll = Math.random() * 100;
      
      // Déterminer la rareté obtenue
      let cumulativeProbability = 0;
      let obtainedRarity = null;
      
      for (const rarity of rarities) {
        cumulativeProbability += rarity.probability;
        if (roll <= cumulativeProbability) {
          obtainedRarity = rarity;
          break;
        }
      }
      
      // Sélectionner un skin aléatoire dans cette catégorie
      const skinsInCategory = skins[obtainedRarity.id];
      const randomSkin = skinsInCategory[Math.floor(Math.random() * skinsInCategory.length)];
      
      // Créer l'objet skin avec ses propriétés
      const skinObject = {
        name: randomSkin,
        rarity: obtainedRarity.id,
        color: obtainedRarity.color,
        obtainedAt: new Date().toISOString()
      };
      
      // Initialiser l'inventaire si nécessaire
      if (!userInventaires[userId]) {
        userInventaires[userId] = [];
      }
      
      // Ajouter le skin à l'inventaire
      userInventaires[userId].push(skinObject);
      saveInventaires();
      
      // Activer l'animation si c'est un couteau
      if (obtainedRarity.id === "extraordinary") {
        animationEnCours = true;
        
        // Désactiver le verrouillage après la durée de l'animation
        setTimeout(() => {
          animationEnCours = false;
          console.log("Animation knife terminée");
        }, animationDuration);
      }
      
      // Annoncer le résultat
      client.say(
        channel,
        `${obtainedRarity.emoji} @${userstate.username} ${obtainedRarity.message}: ${randomSkin} ${obtainedRarity.emoji}`
      );
    }

    // Nouvelle commande: !inventaire
    if (command === CMD.INVENTAIRE) {
      const userId = userstate["user-id"];
      
      if (userInventaires[userId] && userInventaires[userId].length > 0) {
        // Trier l'inventaire par rareté (les plus rares en premier)
        const sortedInventory = [...userInventaires[userId]].sort((a, b) => {
          const rarityA = rarities.findIndex(r => r.id === a.rarity);
          const rarityB = rarities.findIndex(r => r.id === b.rarity);
          return rarityB - rarityA;
        });
        
        // Limiter à 10 items pour éviter les messages trop longs
        const displayItems = sortedInventory.slice(0, 10);
        const inventoryDisplay = displayItems.map((item, index) => {
          const itemRarity = rarities.find(r => r.id === item.rarity);
          return `${index + 1}. ${itemRarity.emoji} ${item.name}`;
        }).join(", ");
        
        const totalItems = sortedInventory.length;
        const message = totalItems > 10 
          ? `${inventoryDisplay} et ${totalItems - 10} autres items...`
          : inventoryDisplay;
        
        client.say(
          channel,
          `@${userstate.username}, voici ton inventaire: ${message}`
        );
      } else {
        client.say(
          channel,
          `@${userstate.username}, tu n'as pas encore ouvert de caisses, utilise !knife pour en ouvrir une!`
        );
      }
    }

    // Commande !stats
    if (command === CMD.STATS) {
      const userId = userstate["user-id"];
      
      if (userInventaires[userId] && userInventaires[userId].length > 0) {
        // Nombre total de caisses ouvertes
        const totalCases = userInventaires[userId].length;
        
        // Meilleur skin obtenu (basé sur la rareté)
        const bestSkin = [...userInventaires[userId]].sort((a, b) => {
          const rarityA = rarities.findIndex(r => r.id === a.rarity);
          const rarityB = rarities.findIndex(r => r.id === b.rarity);
          return rarityB - rarityA;
        })[0];
        
        const bestSkinRarity = rarities.find(r => r.id === bestSkin.rarity);
        
        // Distribution des skins par rareté
        const distribution = {};
        rarities.forEach(rarity => {
          distribution[rarity.id] = userInventaires[userId].filter(
            skin => skin.rarity === rarity.id
          ).length;
        });
        
        // Formatage de la distribution pour affichage
        const distributionText = rarities
          .filter(rarity => distribution[rarity.id] > 0)
          .map(rarity => `${rarity.emoji} ${distribution[rarity.id]}`)
          .join(", ");
        
        client.say(
          channel,
          `@${userstate.username}, tu as ouvert ${totalCases} caisses. Ton meilleur skin: ${bestSkinRarity.emoji} ${bestSkin.name}. Distribution: ${distributionText}`
        );
      } else {
        client.say(
          channel,
          `@${userstate.username}, tu n'as pas encore ouvert de caisses, utilise !${CMD.KNIFE} pour commencer!`
        );
      }
    }

    // Commande !top ou !leaderboard
    if (command === CMD.TOP || command === CMD.LEADERBOARD) {
      // Créer un tableau d'utilisateurs avec leur meilleur skin
      const users = [];
      
      // Parcourir tous les inventaires
      for (const userId in userInventaires) {
        if (userInventaires[userId] && userInventaires[userId].length > 0) {
          // Trouver le meilleur skin pour cet utilisateur
          const bestSkin = [...userInventaires[userId]].sort((a, b) => {
            const rarityA = rarities.findIndex(r => r.id === a.rarity);
            const rarityB = rarities.findIndex(r => r.id === b.rarity);
            return rarityB - rarityA;
          })[0];
          
          users.push({
            userId: userId,
            bestSkin: bestSkin,
            rarityIndex: rarities.findIndex(r => r.id === bestSkin.rarity)
          });
        }
      }
      
      if (users.length > 0) {
        // Trier par rareté décroissante
        users.sort((a, b) => b.rarityIndex - a.rarityIndex);
        
        // Remplacer la partie qui construit le topUsers dans la commande !top
        // Afficher les 5 premiers
        const topUsers = users.slice(0, 5).map((user, index) => {
          const userRarity = rarities[user.rarityIndex];
          const username = getUsernameById(user.userId);
          return `${index + 1}. @${username} - ${userRarity.emoji} ${user.bestSkin.name}`;
        }).join(" | ");
        
        client.say(
          channel,
          `🏆 TOP 5 INVENTAIRES: ${topUsers}`
        );
      } else {
        client.say(
          channel,
          `Aucun utilisateur n'a encore ouvert de caisses. Soyez le premier avec !${CMD.KNIFE}!`
        );
      }
    }

    // Commande !chance
    if (command === CMD.CHANCE) {
      const chances = rarities.map(rarity => 
        `${rarity.emoji} ${rarity.name}: ${rarity.probability.toFixed(2)}%`
      ).join(" | ");
      
      client.say(
        channel,
        `💯 Chances d'obtention: ${chances}`
      );
    }

    // Commande !gift <utilisateur> <numéro item>
    if (command === CMD.GIFT) {
      const args = message.split(" ");
      
      if (args.length !== 3) {
        client.say(
          channel,
          `@${userstate.username}, utilisation correcte: !${CMD.GIFT} <utilisateur> <numéro item>`
        );
        return;
      }
      
      const targetUsername = args[1].replace('@', '').toLowerCase();
      const itemNumber = parseInt(args[2]) - 1; // L'index commence à 0 mais l'affichage à 1
      
      const senderId = userstate["user-id"];
      
      // Vérifier que l'utilisateur a un inventaire et que l'index est valide
      if (!userInventaires[senderId] || itemNumber < 0 || itemNumber >= userInventaires[senderId].length) {
        client.say(
          channel,
          `@${userstate.username}, cet item n'existe pas dans ton inventaire. Utilise !${CMD.INVENTAIRE} pour voir tes skins.`
        );
        return;
      }
      
      // Trouver le destinataire (simplification - utilisateurs ayant déjà interagi)
      let targetId = null;
      for (const userId in userInventaires) {
        if (userId !== senderId) { // Exemple simple, en réalité il faudrait une base de données username -> ID
          targetId = userId;
          break;
        }
      }
      
      if (!targetId) {
        client.say(
          channel,
          `@${userstate.username}, je ne trouve pas l'utilisateur "${targetUsername}" ou il n'a jamais interagi avec le bot.`
        );
        return;
      }
      
      // Récupérer le skin
      const gift = userInventaires[senderId].splice(itemNumber, 1)[0];
      
      // Initialiser l'inventaire du destinataire si nécessaire
      if (!userInventaires[targetId]) {
        userInventaires[targetId] = [];
      }
      
      // Ajouter le skin à l'inventaire du destinataire
      userInventaires[targetId].push(gift);
      
      // Sauvegarder les inventaires
      saveInventaires();
      
      // Trouver la rareté pour afficher l'emoji
      const giftRarity = rarities.find(r => r.id === gift.rarity);
      
      client.say(
        channel,
        `🎁 @${userstate.username} a offert ${giftRarity.emoji} ${gift.name} à User-${targetId.slice(-4)}!`
      );
    }

    // Commande !search <nom>
    if (command === CMD.SEARCH) {
      const args = message.split(" ");
      
      if (args.length < 2) {
        client.say(
          channel,
          `@${userstate.username}, utilisation correcte: !${CMD.SEARCH} <terme de recherche>`
        );
        return;
      }
      
      // Le terme de recherche est tout ce qui suit !search
      const searchTerm = message.substring(command.length + 2).toLowerCase();
      const userId = userstate["user-id"];
      
      // Vérifier que l'utilisateur a un inventaire
      if (!userInventaires[userId] || userInventaires[userId].length === 0) {
        client.say(
          channel,
          `@${userstate.username}, tu n'as pas encore de skins dans ton inventaire. Utilise !${CMD.KNIFE} pour en obtenir!`
        );
        return;
      }
      
      // Rechercher les skins correspondants
      const matchingSkins = userInventaires[userId].filter(skin => 
        skin.name.toLowerCase().includes(searchTerm)
      );
      
      if (matchingSkins.length > 0) {
        // Limiter à 5 résultats pour éviter les messages trop longs
        const results = matchingSkins.slice(0, 5).map((skin, index) => {
          const skinRarity = rarities.find(r => r.id === skin.rarity);
          return `${index + 1}. ${skinRarity.emoji} ${skin.name}`;
        }).join(", ");
        
        const totalMatches = matchingSkins.length;
        const message = totalMatches > 5 
          ? `${results} et ${totalMatches - 5} autres résultats...`
          : results;
        
        client.say(
          channel,
          `@${userstate.username}, résultats pour "${searchTerm}": ${message}`
        );
      } else {
        client.say(
          channel,
          `@${userstate.username}, aucun skin contenant "${searchTerm}" trouvé dans ton inventaire.`
        );
      }
    }
  }
});
