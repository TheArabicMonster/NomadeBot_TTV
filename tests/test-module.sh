#!/bin/bash
# Script pour tester un module spécifique avec différentes options

# Vérifier si un module est spécifié
if [ -z "$1" ]; then
  echo "Usage: $0 <module_name> [--watch]"
  echo "Example: $0 utils/logger"
  echo "Example: $0 utils/messageQueue --watch"
  exit 1
fi

MODULE=$1
WATCH_FLAG=""

# Vérifier si l'option watch est activée
if [ "$2" == "--watch" ]; then
  WATCH_FLAG="--watch"
fi

# Exécuter le test avec les options spécifiées
echo "🧪 Exécution des tests pour le module: $MODULE $WATCH_FLAG"
npx jest $MODULE $WATCH_FLAG --verbose
