# WIP Island — version responsive

Cette archive est prête à remplacer les fichiers du dépôt GitHub Pages.

## Mise à jour GitHub
1. Décompressez l’archive.
2. Ouvrez le dossier `WIP-Island`.
3. Envoyez **tout le contenu** de ce dossier à la racine de votre dépôt GitHub.
4. Acceptez le remplacement des anciens fichiers, puis attendez le redéploiement GitHub Pages.

Ne placez pas le dossier `WIP-Island` lui-même dans le dépôt : `index.html` doit être à la racine.

## Organisation
- `index.html` : structure légère de la page.
- `style.css` : styles et adaptations responsive.
- `app.js` : logique de l’application et personnalisation.
- `wip-sprites/` : sprites des compagnons et du personnage.

Les quatre sprites d’Ophanim sont directement dans `wip-sprites/` (`ophanim-idle.png`, `ophanim-happy.png`, `ophanim-sleep.png`, `ophanim-action.png`) et non dans un sous-dossier.

Les images des compagnons sont chargées depuis leurs fichiers PNG séparés ; elles ne sont plus intégrées en base64 dans le JavaScript.
