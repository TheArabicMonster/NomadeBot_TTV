/**
 * Script de migration des inventaires
 * 
 * Ce script transfère les inventaires du bot Twitch vers le système partagé.
 */
const fs = require('fs');
const path = require('path');

// Chemin vers les fichiers d'inventaire
const OLD_INVENTORY_PATH = path.join(__dirname, '..', 'data', 'static', 'inventories.json');
const SHARED_INVENTORY_PATH = path.join(__dirname, '..', '..', 'NomadeBot_SHARED', 'data', 'static', 'inventories.json');

// Vérification de l'existence du dossier partagé
const sharedDir = path.join(__dirname, '..', '..', 'NomadeBot_SHARED', 'data', 'static');
if (!fs.existsSync(sharedDir)) {
  fs.mkdirSync(sharedDir, { recursive: true });
  console.log('📁 Dossier partagé créé: ', sharedDir);
}

// Lecture des inventaires existants
let oldInventories = {};
if (fs.existsSync(OLD_INVENTORY_PATH)) {
  try {
    const data = fs.readFileSync(OLD_INVENTORY_PATH, 'utf8');
    oldInventories = JSON.parse(data);
    console.log(`✅ ${Object.keys(oldInventories).length} inventaires chargés depuis le bot Twitch`);
  } catch (error) {
    console.error('❌ Erreur lors de la lecture des inventaires du bot Twitch:', error);
    process.exit(1);
  }
} else {
  console.log('⚠️ Aucun fichier d\'inventaires trouvé pour le bot Twitch');
}

// Lecture des inventaires partagés existants
let sharedInventories = {};
if (fs.existsSync(SHARED_INVENTORY_PATH)) {
  try {
    const data = fs.readFileSync(SHARED_INVENTORY_PATH, 'utf8');
    sharedInventories = JSON.parse(data);
    console.log(`✅ ${Object.keys(sharedInventories).length} inventaires déjà présents dans le système partagé`);
  } catch (error) {
    console.error('❌ Erreur lors de la lecture des inventaires partagés:', error);
    // Continuer avec un objet vide
  }
}

// Fusion des inventaires
for (const [userId, items] of Object.entries(oldInventories)) {
  if (sharedInventories[userId]) {
    console.log(`⚠️ L'utilisateur ${userId} existe déjà dans le système partagé. Fusion des inventaires...`);
    
    // Créer un Set pour éviter les doublons
    const uniqueItems = new Set([...sharedInventories[userId], ...items]);
    sharedInventories[userId] = Array.from(uniqueItems);
    
    console.log(`✅ Inventaire de ${userId} fusionné: ${sharedInventories[userId].length} objets`);
  } else {
    sharedInventories[userId] = items;
    console.log(`✅ Inventaire de ${userId} ajouté: ${items.length} objets`);
  }
}

// Sauvegarde des inventaires dans le système partagé
try {
  fs.writeFileSync(SHARED_INVENTORY_PATH, JSON.stringify(sharedInventories, null, 2));
  console.log(`✅ ${Object.keys(sharedInventories).length} inventaires sauvegardés dans le système partagé`);
} catch (error) {
  console.error('❌ Erreur lors de la sauvegarde des inventaires partagés:', error);
  process.exit(1);
}

console.log('✅ Migration des inventaires terminée avec succès!');