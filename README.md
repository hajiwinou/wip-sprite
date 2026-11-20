# WIP Island — correctif complet GitHub Pages

## Contenu
- `index.html` : page d’entrée, avec paramètres anti-cache pour les ressources locales.
- `style.css` : styles et adaptations mobiles.
- `app.js` : logique de la scène, compagnon et personnalisation.
- `wip-sprites/` : sprites PNG, y compris les quatre poses d’Ophanim à la racine du dossier.

## Mise à jour GitHub depuis iPhone
1. Décompresser l’archive dans Fichiers.
2. Dans le dépôt, remplacer `index.html`, `style.css`, `app.js` et le contenu de `wip-sprites/` en conservant exactement cette arborescence.
3. Valider tous les changements dans un commit.
4. Attendre la fin du déploiement GitHub Pages dans Actions.
5. Ouvrir le site dans un nouvel onglet Safari ou faire un rechargement forcé.

Ne téléversez pas le dossier parent : `index.html` doit rester à la racine publiée.

## Contrôles effectués sur cette archive
- Syntaxe JavaScript vérifiée avec `node --check`.
- Références CSS/JS et chemins des sprites vérifiés.
- Les 17 compagnons ont chacun quatre fichiers PNG attendus.
- Les valeurs de profil localStorage sont normalisées avant le premier rendu.

Le rendu final doit encore être confirmé sur le vrai site GitHub Pages et sur l’iPhone.
