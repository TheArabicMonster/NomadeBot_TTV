/**
 * Commandes liées à l'inventaire d'items
 */
const inventory = require("../data/inventory");
const users = require("../data/users");
const rarities = require("../data/static/rarities");
const config = require("../config/config");
const messageQueue = require("../utils/messageQueue"); 

/**
 * Commande !inventaire - Affiche l'inventaire d'un utilisateur
 */
function showInventory(client, channel, userstate, args) {
  const userId = userstate["user-id"];
  const username = userstate.username;
  const userInventory = inventory.getUserInventory(userId);

  if (!userInventory || userInventory.length === 0) {
    client.say(
      channel,
      `@${username}, tu n'as pas encore de skins dans ton inventaire. Utilise !knife pour en obtenir!`
    );
    return;
  }

  // Page demandée (par défaut: 1)
  let page = 1;
  if (args.length > 0) {
    const requestedPage = parseInt(args[0]);
    if (!isNaN(requestedPage) && requestedPage > 0) {
      page = requestedPage;
    }
  }

  const pageSize = config.display.inventoryPageSize;
  const totalPages = Math.ceil(userInventory.length / pageSize);

  // S'assurer que la page demandée existe
  if (page > totalPages) {
    page = totalPages;
  }

  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, userInventory.length);

  // Construire la liste des skins pour cette page
  const inventoryList = userInventory
    .slice(start, end)
    .map((skin, index) => {
      const skinRarity = rarities.find((r) => r.id === skin.rarity);
      return `${start + index + 1}. ${skinRarity.emoji} ${skin.name}`;
    })
    .join(", ");

  const pageInfo = totalPages > 1 ? ` (Page ${page}/${totalPages})` : "";

  // Envoyer la réponse en message privé
  messageQueue.enqueueWhisper(
    client,
    username,
    `Ton inventaire${pageInfo}: ${inventoryList}`
  );

  // Envoyer une confirmation dans le chat public
  client.say(
    channel,
    `@${username}, je t'ai envoyé ton inventaire en message privé.`
  );
}

/**
 * Commande !search - Recherche des skins dans l'inventaire
 */
function searchInventory(client, channel, userstate, args, fullCommand) {
  if (args.length === 0) {
    client.say(
      channel,
      `@${userstate.username}, utilisation: !search <terme de recherche>`
    );
    return;
  }

  const userId = userstate["user-id"];
  const username = userstate.username;
  const userInventory = inventory.getUserInventory(userId);

  if (!userInventory || userInventory.length === 0) {
    client.say(
      channel,
      `@${username}, tu n'as pas encore de skins dans ton inventaire. Utilise !knife pour en obtenir!`
    );
    return;
  }

  // Le terme de recherche est tout ce qui suit !search
  const searchTerm = fullCommand.substring(8).toLowerCase().trim();

  // Recherche des skins correspondants
  const matchingSkins = userInventory.filter((skin) =>
    skin.name.toLowerCase().includes(searchTerm)
  );

  if (matchingSkins.length === 0) {
    client.say(
      channel,
      `@${username}, aucun skin contenant "${searchTerm}" trouvé dans ton inventaire.`
    );
    return;
  }

  // Limiter à 5 résultats pour éviter de spammer
  const maxResults = config.display.maxResultsPerList;
  const results = matchingSkins
    .slice(0, maxResults)
    .map((skin, index) => {
      const skinRarity = rarities.find((r) => r.id === skin.rarity);
      return `${index + 1}. ${skinRarity.emoji} ${skin.name}`;
    })
    .join(", ");

  const totalMatches = matchingSkins.length;
  const message =
    totalMatches > maxResults
      ? `${results} et ${totalMatches - maxResults} autres résultats...`
      : results;

  // Envoyer en message privé
  messageQueue.enqueueWhisper(
    client,
    username,
    `Résultats pour "${searchTerm}": ${message}`
  );

  // Confirmation dans le chat public
  client.say(
    channel,
    `@${username}, je t'ai envoyé les résultats de ta recherche en message privé.`
  );
}

module.exports = {
  showInventory,
  searchInventory,
};
