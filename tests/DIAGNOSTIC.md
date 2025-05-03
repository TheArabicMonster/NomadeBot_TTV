# Diagnostic des Tests

Ce document fournit des informations pour diagnostiquer les problèmes avec vos tests.

## Commandes utiles

### Vérifier la version de Node.js et NPM
```bash
node -v
npm -v
```

### Vérifier que Jest est correctement installé
```bash
npx jest --version
```

### Lister les environnements disponibles
```bash
npx jest --showConfig | grep testEnvironment
```

### Exécuter Jest avec des logs détaillés
```bash
npx jest --verbose
```

### Déboguer un test spécifique
```bash
npx jest tests/utils/logger.test.js --verbose
```

### Exécuter un test spécifique avec le debugger de Node.js
```bash
node --inspect-brk node_modules/.bin/jest tests/utils/logger.test.js
```

## Problèmes courants et solutions

### 1. Erreur "Cannot find module"
- Vérifiez que toutes les dépendances sont installées: `npm install`
- Vérifiez que le chemin du module est correct

### 2. Erreur de timeout
- Augmentez le timeout dans `jest.config.js` 
- Vérifiez s'il y a des opérations asynchrones qui ne se terminent pas

### 3. Les tests ne s'exécutent pas comme prévu
- Vérifiez que `jest.useFakeTimers()` et `jest.useRealTimers()` sont utilisés correctement
- Assurez-vous de nettoyer les mocks avec `jest.clearAllMocks()` entre les tests

### 4. Problèmes avec les tests de modules avec état (singletons)
- Utilisez `jest.isolateModules(() => { ... })` pour réinitialiser l'état entre les tests
- Ajoutez des fonctions `reset()` à vos modules pour les tests

### 5. Les variables d'environnement ne fonctionnent pas
- Assurez-vous que `process.env` est correctement configuré dans vos tests
- Utilisez `setupFiles` dans `jest.config.js` pour configurer l'environnement avant chaque test
