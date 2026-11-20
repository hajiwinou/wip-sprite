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
