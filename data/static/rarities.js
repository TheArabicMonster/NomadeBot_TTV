// Définition des raretés avec leurs probabilités et couleurs
const rarities = [
  {
    id: "mil-spec",
    name: "Qualité Militaire",
    color: "#4b69ff", // Bleu
    emoji: "🔵",
    probability: 79.92, // ~80%
    message: "a obtenu un skin de qualité mil-spec... la routine"
  },
  {
    id: "restricted",
    name: "Restreint",
    color: "#8847ff", // Violet
    emoji: "🟣",
    probability: 15.98, // ~16%
    message: "a obtenu un skin restreint, début de la richesse!"
  },
  {
    id: "classified",
    name: "Classifié",
    color: "#d32ce6", // Rose
    emoji: "🟪",
    probability: 3.2, // ~3.2%
    message: "a obtenu un skin classified! Pas mal!"
  },
  {
    id: "covert",
    name: "Discret",
    color: "#eb4b4b", // Rouge
    emoji: "🔴",
    probability: 0.64, // ~0.64%
    message: "a ouvert un skin COVERT! Quelle chance!"
  },
  {
    id: "extraordinary",
    name: "★ Exceptionnel ★",
    color: "#caab05", // Jaune doré
    emoji: "🔪",
    probability: 0.26, // ~0.26%
    message: "a ouvert un COUTEAU! !!INCROYABLE!!"
  }
];

module.exports = rarities;