# Tests du NomadeBot_TTV

Ce dossier contient les tests automatisés pour vérifier le bon fonctionnement du bot.

## Structure

Les tests sont organisés par catégories:
- `utils/`: Tests pour les fonctions utilitaires
- `commands/`: Tests pour les commandes du bot
- `data/`: Tests pour la gestion des données
- `integration/`: Tests d'intégration

## Comment lancer les tests

### Lancer tous les tests
```bash
npm test
```

### Lancer une catégorie spécifique
```bash
npm test -- tests/utils
```

### Lancer un fichier de test spécifique
```bash
npm test -- tests/utils/helpers.test.js
```

### Lancer les tests en mode watch (relance auto)
```bash
npm run test:watch
```

## Bonnes pratiques

1. Écrire des tests pour chaque nouvelle fonctionnalité
2. Maintenir les tests à jour lorsque le code change
3. Vérifier que tous les tests passent avant de déployer

## Couverture de tests

Pour générer un rapport de couverture de tests:
```bash
npm run test:coverage
```
Le rapport sera disponible dans le dossier `coverage/`.
