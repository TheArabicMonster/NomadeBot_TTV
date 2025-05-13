# NomadeBot_TTV

🌍 **Langue / Language** :
[Français](./README.md) | [English](./README.en.md)

---

An interactive Twitch bot allowing viewers to open virtual CS2 crates and collect skins.

## 📋 Description

NomadeBot_TTV is a Twitch bot that livens up streams by allowing viewers to interact with a CS2-inspired virtual crate opening system. Users can obtain skins of various rarities, view their inventory, see stats and even trade skins.

## ✨ Features

- Virtual crate system**: Get CS2 virtual skins with the `!skin` command.
- Personal inventory**: Each user has a persistent inventory.
- **Different rarities**: From Mil-Spec (blue) to Extraordinary (knives ★)
- Statistics**: Consult your statistics and compare them with those of others.
- Skins swap**: Offer your skins to other users
- Periodic messages**: The bot sends random humorous messages
- **Coldown system**: Limit the use of commands

## 🔧 Installation

### Prerequisites
- Node.js 14.0.0 or later
- Twitch Bot account
- Twitch OAuth token

### Installation steps
1. Clone the repository:
```bash
git clone https://github.com/votre-username/NomadeBot_TTV.git
cd NomadeBot_TTV
````

2. Install dependencies:
```bash
npm install
```

3. Create an `.env` file in the project root with the following information:
```
TWITCH_BOT_USERNAME=your_bot_username
TWITCH_TOKEN=oauth:votre_token
TWITCH_CHANNEL=your_channel
NODE_ENV=production
```

4. Start the bot:
```bash
node index.js
```

## ⚙️ Configuration

The bot can be configured via the `config/config.js` file. Here you can adjust :
- command cooldowns
- Animation duration
- Periodic message intervals
- Display parameters

## 🎮 Available commands

| Command | Description |
|---------|-------------|
| `!help` or `!commandes` | Displays list of available commands |
| `!hello` | The bot greets you |
| `!dice` | Throws a 6-sided dice |
| `!info` | Displays information about the bot |
| `!skin` | Opens a virtual cash register to obtain a skin |
| `!inventory` [page] | Displays your inventory of skins |
| `! stats` | Displays your statistics |
| `!top` or `!leaderboard` | Displays the ranking of the best inventories |
| `!chance` | Displays the chances of obtaining different rarities |
| `!gift <user> <number>` | Offers a skin from your inventory to another user |
| `!search <term>` | Searches for a skin in your inventory |

## 📂 Project structure

```
NomadeBot_TTV/
├── config/ # Configuration
│ ├── config.js # General parameters
│ ├── messages. js # Bot messages and texts
│ └── user_map.json # Associates Twitch IDs with usernames
├── data/ # Data
│ ├── inventory. js # Inventory management
│ ├── users.js # User management
│ └── static/ # Static data
│ ├── knives. js # List of skins
│ └── rarities.js # Definition of rarities
├── commands/ # Bot commands
│ ├── index.js # Entry point for commands
│ ├── basic. js # Basic commands
│ ├── knife.js # Main opening command
│ ├── inventory.js # Inventory management
│ ├── stats. js # Statistics
│ └── gift.js # Skins exchange
├── utils/ # Utilities
│ ├── helpers. js # Miscellaneous help functions
│ └── logger.js # Logging system
├── .env # Environment variables (to be created)
├── . gitignore # Files ignored by git
├── index.js # Main entry point
├── package.json # Configuration npm
└── README.md # Documentation
````
## 📊 Rarity System

The bot uses different rarities for skins, inspired by CS2:
- **Mil-Spec** (blue) - Common
- **Restricted** (purple) - Uncommon
- **Classified** (pink) - Rare
- **Covert** (red) - Very Rare
- **Extraordinary** (yellow) - Extremely Rare (knives)

## 🔄 Data Persistence

User data is stored in three JSON files:
- `inventories.json` - Contains all user inventories
- `cooldowns.json` - Manages command cooldowns
- `config/user_map.json` - Associates Twitch IDs with usernames

## 🛠️ Development

To run the bot in development mode:
```bash
NODE_ENV=development node index.js
```

## 🤝 Contribution

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.

## 📧 Contact

For any questions or suggestions, please contact me on Twitch: [@NomadeEUW](https://twitch.tv/NomadeEUW)
