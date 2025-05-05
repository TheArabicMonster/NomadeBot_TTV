/**
 * Liste des récompenses quotidiennes possibles
 * Ces items peuvent être obtenus via la commande !daily
 */

// Les récompenses sont divisées par catégories de rareté
const dailyRewards = {
  // Items communs (65% de chance)
  common: [
    "Caillou",
    "Bout de bois",
    "Feuille d'arbre",
    "Bouton",
    "Bouchon",
    "Trèfle à 3 feuilles",
    "Élastique",
    "Trombone",
    "Bille en verre",
    "Plume de pigeon",
    "Crayon usé",
    "Boîte vide",
    "Canette écrasée",
    "Ticket de caisse",
    "Confetti"
  ],
  
  // Items peu communs (20% de chance)
  uncommon: [
    "Boussole",
    "Canif",
    "Gourde",
    "Lance-pierre",
    "Loupe",
    "Montre à gousset",
    "Briquet",
    "Dé à 20 faces",
    "Carnet en cuir",
    "Écharpe colorée",
    "Porte-bonheur",
    "Figurine en bois",
    "Bracelet tressé",
    "Pierre polie",
    "Boule de neige"
  ],
  
  // Items rares (10% de chance)
  rare: [
    "Pokéball",
    "Écu de chevalier",
    "Épée en acier",
    "Arc elfique",
    "Miroir magique",
    "Grimoire ancien",
    "Parchemin scellé",
    "Bague enchantée",
    "Amulette protectrice",
    "Fiole de potion",
    "Arc en cuivre",
    "Heaume royal",
    "Pendentif runique",
    "Trèfle à 4 feuilles",
    "Dague ornementée"
  ],
  
  // Items légendaires (4% de chance)
  legendary: [
    "Enclume du forgeron divin",
    "Marteau de Thor",
    "Flûte enchantée",
    "Cape de l'invisibilité",
    "Bouclier du gardien",
    "Couronne de Lumière",
    "Cristal des anciens",
    "Sceptre du pouvoir",
    "Armure de dragon",
    "Lame du chaos",
    "Bâton du sage",
    "Orbe de la connaissance",
    "Talisman du temps",
    "Arc de l'étoile filante",
    "Joyau de l'éternité"
  ],
  
  // Items mythiques (1% de chance)
  mythic: [
    "Excalibur",
    "Trident de Poséidon",
    "Oeil d'Agamotto",
    "Saint Graal",
    "Baguette de Sureau",
    "Anneau unique",
    "Pierre philosophale",
    "Pomme d'or d'Idun",
    "Égide de Zeus",
    "Mjölnir",
    "Gants de l'infini",
    "Corne d'Heimdall",
    "Casque d'invisibilité d'Hadès",
    "Toison d'Or",
    "Tablette des Commandements"
  ]
};

// Export du module
module.exports = dailyRewards;