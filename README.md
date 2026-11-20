# WIP Island — dreamOS

## Compagnons disponibles

La collection comprend désormais **12 compagnons**, chacun avec quatre poses (`idle`, `happy`, `sleep`, `action`) :

- Lapin
- Chat
- Tortue
- Pelote
- Poulpe
- Narval
- Escargot
- Grenouille
- Mouton
- Bouton
- Llama
- Étoile de mer

## Affichage et compatibilité

Tous les sprites PNG sont embarqués directement dans `index.html` sous forme de données intégrées. Le fichier est autonome : aucun dossier d'images séparé n'est requis pour afficher les compagnons, y compris sur GitHub Pages et mobile.

## Personnalisation

Le sélecteur de compagnon est alimenté automatiquement par la liste `PN`. Le nom du compagnon, le profil et les états de session existants sont conservés. Les états affichent les poses correspondantes : Pause → sommeil, Je tricote → joie, Projet fini → action.

## Fichiers

- `index.html` : version autonome à publier sur GitHub Pages.
- `wip-sprites/` : les 48 PNG sources individuels, utiles si tu souhaites les réutiliser ou les modifier.
