# WIP Island — base propre à calques

## Structure
- `index.html` : structure de la page.
- `style.css` : mise en page responsive et animations.
- `app.js` : interactions, sauvegarde et composition des calques.
- `wip-sprites/human/` : quatre poses du sprite humain original.
- `wip-sprites/human/layers/` : documentation de la bibliothèque de calques.
- `wip-sprites/ophanim-*.png` : les quatre poses découpées depuis le sprite Ophanim fourni.

## Important
Le personnage est maintenant chargé depuis `wip-sprites/human/*.png`. Le générateur pixel-art de l'ancien humain a été retiré du chemin de rendu. Les couleurs de peau, cheveux et vêtements sont appliquées au sprite PNG par masques de pixels. Les coiffures et accessoires sont composés au-dessus comme calques SVG indépendants. Les accessoires sont multi-sélectionnables.

Lovelace reçoit un visage expressif ajouté au rendu. Ophanim utilise le sprite fourni et une animation de lévitation.

## Publication GitHub Pages
Conserver les chemins et dossiers tels quels. Téléverser le contenu de ce dossier à la racine de la branche publiée par GitHub Pages.


## Mise à jour avatar & Kiwi (21 novembre 2026)

- Le personnage principal utilise désormais `wip-sprites/human/avatar-base.png`, un sprite chibi plus grand et visuellement harmonisé avec les compagnons.
- Le rendu humain est agrandi sur mobile pour rester le sujet principal de la scène.
- Le compagnon `Kiwi` est ajouté disponible dans les quatre états (idle, happy, sleep, action) et animé en vol stationnaire par CSS.
- Ophanim conserve son animation aérienne.
- Lovelace conserve son visage superposé (yeux, sourire et joues roses).
- Les noms de compagnons sont conservés et Kiwi apparaît dans le sélecteur.

Pour mettre à jour GitHub Pages, remplace `index.html`, `style.css`, `app.js` et ajoute les nouveaux fichiers `wip-sprites/kiwi-*.png` ainsi que `wip-sprites/human/avatar-base.png`. Les anciens fichiers humains restent dans le dossier pour compatibilité.


## Mise à jour de l'atelier avatar (21 novembre 2026)

- L'ancien long formulaire de personnalisation est remplacé par un atelier à catégories : Peau, Coiffures, Vêtements et Accessoires.
- Les choix sont présentés sous forme de cartes visuelles et de palettes.
- Le sprite de Lovelace inclut maintenant son visage directement dans l'image (aucun visage HTML superposé).
- Kiwi utilise un sprite nuage plus petit, avec visage intégré et animation de vol stationnaire.
- Le personnage humain est mis en avant dans la scène ; les compagnons sont affichés à une échelle plus discrète.
- La nouvelle sauvegarde locale utilise la clé `wipProfileStudioV2` afin de repartir avec les paramètres de ce nouvel atelier sans effacer l'ancienne sauvegarde.


## Version iPhone — atelier vertical
- Présentation de personnalisation conservée en une seule colonne verticale, comme l’ancienne interface mobile.
- Les quatre sections (peau, coiffures, vêtements, accessoires) restent visibles et se suivent dans la page.
- Les nouvelles cartes de choix, palettes, sprites et possibilités de superposition sont conservés.
- Grilles à deux colonnes sur iPhone, zones tactiles agrandies et largeur limitée pour éviter le débordement horizontal.
