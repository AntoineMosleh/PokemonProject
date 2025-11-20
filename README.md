# Pokémon Finder & Comparator

Petit projet front-end qui interroge la PokeAPI pour rechercher un Pokémon par nom ou ID, afficher ses statistiques et comparer deux Pokémon avec un graphique (Chart.js).

Fonctionnalités
- Recherche par nom ou ID
- Affichage des statistiques sous forme de liste et graphique (barres)
- Comparaison de 2 Pokémon (radar)

Pré-requis
- Node.js (pour exécuter les tests)

Lancer localement
1. Ouvrir la page directement (double-clic sur `index.html`) ou lancer un serveur local depuis le dossier du projet :

```powershell
python -m http.server 8000
# puis ouvrir http://localhost:8000
```

Tests unitaires

Installer les dépendances et lancer les tests :

```powershell
npm install
npm test
```

Fichiers principaux
- `index.html` — interface
- `style.css` — styles
- `main.js` — logique UI
- `api.js` — helper réutilisable pour appeler PokeAPI (aide pour les tests)

Améliorations possibles
- Indicateur de chargement, cache, pagination, plus d'informations du Pokémon.
