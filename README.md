# WIP Island — Atelier avatar (version iPhone)

Cette archive contient la version verticale mobile de WIP Island et son atelier de personnalisation.

## Fichiers principaux
- `index.html` : structure de la page et chargement des ressources.
- `style.css` : présentation responsive, notamment pour iPhone.
- `app.js` : interactions, choix de l'avatar, compagnons et sauvegarde du profil.
- `wip-sprites/` : sprites des compagnons et de l'humain.
- `wip-sprites/human/layers/` : bibliothèque des coiffures, vêtements, accessoires et miniatures PNG.

## Atelier avatar
- 8 teintes de peau et 12 couleurs de cheveux.
- 9 coiffures pixel art recolorables + hijab intégré comme coiffure exclusive et recolorable.
- Tenues raster (T-shirt, pull, sweat, robe, salopette) et pièces additionnelles cumulables.
- Accessoires multi-sélectionnables ; le hijab est dans les coiffures et remplace les cheveux.
- Les choix sont enregistrés automatiquement dans le navigateur.

## Mise à jour GitHub Pages
Remplace les anciens fichiers par le contenu complet de cette archive, en conservant les dossiers et leurs chemins (`wip-sprites/` compris). Vérifie que `index.html`, `app.js`, `style.css` et `wip-sprites/` sont tous à la racine du dépôt. Après le commit, recharge le site en navigation privée ou vide le cache si l'ancienne version reste affichée.

## Notes
Les PNG de vêtements et d'accessoires sont de vrais calques transparents alignés sur le personnage, et non de simples symboles affichés dans les boutons. Les différentes coupes de tenues restent une bibliothèque évolutive : les silhouettes pourront être enrichies sans modifier le système de calques.
