# NomadeBot_TTV

Un bot Twitch interactif permettant aux viewers d'ouvrir des caisses CS2 virtuelles et de collectionner des skins.

## 📋 Description

NomadeBot_TTV est un bot Twitch qui anime les streams en permettant aux spectateurs d'interagir avec un système d'ouverture de caisses virtuelles inspiré de CS2. Les utilisateurs peuvent obtenir des skins de différentes raretés, consulter leur inventaire, voir des statistiques et même s'échanger des skins.

## ✨ Fonctionnalités

- **Système de caisses virtuelles** : Obtenez des skins virtuels CS2 avec la commande `!knife`
- **Inventaire personnel** : Chaque utilisateur dispose d'un inventaire persistant
- **Différentes raretés** : De Mil-Spec (bleu) à Extraordinary (couteaux ★)
- **Statistiques** : Consultez vos statistiques et comparez-les à celles des autres
- **Échange de skins** : Offrez vos skins à d'autres utilisateurs
- **Messages périodiques** : Le bot envoie des messages humoristiques aléatoires
- **Système de cooldown** : Limite l'utilisation des commandes

## 🔧 Installation

### Prérequis
- Node.js 14.0.0 ou plus récent
- Compte Twitch Bot
- Token OAuth Twitch

### Étapes d'installation
1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/NomadeBot_TTV.git
cd NomadeBot_TTV
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les informations suivantes :
```
TWITCH_BOT_USERNAME=votre_bot_username
TWITCH_TOKEN=oauth:votre_token
TWITCH_CHANNEL=votre_channel
NODE_ENV=production
```

4. Démarrez le bot :
```bash
node index.js
```

## ⚙️ Configuration

Le bot est configurable via le fichier `config/config.js`. Vous pouvez y ajuster :
- Les cooldowns des commandes
- La durée des animations
- Les intervalles des messages périodiques
- Les paramètres d'affichage

## 🎮 Commandes disponibles

| Commande | Description |
|---------|-------------|
| `!help` ou `!commandes` | Affiche la liste des commandes disponibles |
| `!hello` | Le bot vous salue |
| `!dice` | Lance un dé à 6 faces |
| `!info` | Affiche des informations sur le bot |
| `!knife` | Ouvre une caisse virtuelle pour obtenir un skin |
| `!inventaire` [page] | Affiche votre inventaire de skins |
| `!stats` | Affiche vos statistiques |
| `!top` ou `!leaderboard` | Affiche le classement des meilleurs inventaires |
| `!chance` | Affiche les chances d'obtention des différentes raretés |
| `!gift <utilisateur> <numéro>` | Offre un skin de votre inventaire à un autre utilisateur |
| `!search <terme>` | Recherche un skin dans votre inventaire |

## 📂 Structure du projet

```
NomadeBot_TTV/
├── config/                     # Configuration
│   ├── config.js               # Paramètres généraux
│   └── messages.js             # Messages et textes du bot
├── data/                       # Données
│   ├── inventory.js            # Gestion des inventaires
│   ├── users.js                # Gestion des utilisateurs
│   └── static/                 # Données statiques
│       ├── knives.js           # Liste des skins
│       └── rarities.js         # Définition des raretés
├── commands/                   # Commandes du bot
│   ├── index.js                # Point d'entrée des commandes
│   ├── basic.js                # Commandes de base
│   ├── knife.js                # Commande principale d'ouverture
│   ├── inventory.js            # Gestion de l'inventaire
│   ├── stats.js                # Statistiques
│   └── gift.js                 # Échange de skins
├── utils/                      # Utilitaires
│   ├── helpers.js              # Fonctions d'aide diverses
│   └── logger.js               # Système de journalisation
├── .env                        # Variables d'environnement (à créer)
├── .gitignore                  # Fichiers ignorés par git
├── index.js                    # Point d'entrée principal
├── package.json                # Configuration npm
└── README.md                   # Documentation
```

## 📊 Système de raretés

Le bot utilise différentes raretés pour les skins, inspirées de CS2 :
- **Mil-Spec** (bleu) - Commun
- **Restricted** (violet) - Peu commun
- **Classified** (rose) - Rare
- **Covert** (rouge) - Très rare
- **Extraordinary** (jaune) - Extrêmement rare (couteaux)

## 🔄 Persistance des données

Les données des utilisateurs sont stockées dans trois fichiers JSON :
- `inventaires.json` - Contient tous les inventaires des utilisateurs
- `cooldowns.json` - Gère les cooldowns des commandes
- `user_map.json` - Associe les IDs Twitch aux noms d'utilisateurs

## 🛠️ Développement

Pour exécuter le bot en mode développement :
```bash
NODE_ENV=development node index.js
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commettre vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à me contacter sur Twitch: [@NomadeEUW](https://twitch.tv/NomadeEUW)
