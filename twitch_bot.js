const tmi = require('tmi.js');
const path = require('path');
const skinData = require('./data/static/knives.js');

// Configuration options for the bot
const opts = {
  identity: {
    username: process.env.BOT_USERNAME || 'NomadeBot',
    password: process.env.BOT_OAUTH_TOKEN || 'oauth:your_token_here'
  },
  channels: [
    process.env.CHANNEL_NAME || 'your_channel'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // Command handling
  if (commandName === '!knife') {
    // Choose a random knife
    const knives = skinData.extraordinary;
    const randomKnife = knives[Math.floor(Math.random() * knives.length)];
    client.say(target, `Random knife: ${randomKnife}`);
  } else if (commandName === '!skin') {
    // Choose a random skin from all categories
    const categories = ['mil-spec', 'restricted', 'classified', 'covert'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const skins = skinData[randomCategory];
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    client.say(target, `Random ${randomCategory} skin: ${randomSkin}`);
  } else if (commandName === '!covert') {
    const skins = skinData.covert;
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    client.say(target, `Random covert skin: ${randomSkin}`);
  } else if (commandName === '!help') {
    client.say(target, 'Commands: !knife, !skin, !covert, !help');
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

console.log('NomadeBot is running!');
