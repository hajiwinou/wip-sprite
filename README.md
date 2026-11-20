# WIP Island — dreamOS

## Compagnons disponibles

La collection comprend 16 compagnons illustrés, chacun avec quatre poses (`idle`, `happy`, `sleep`, `action`) :

- Lemon — lapin
- Fibonacci — chat
- Leto — tortue
- Lovelace — pelote
- Chopard — poulpe
- Socrate — narval
- Platon — escargot
- Artemis — grenouille
- Diana — mouton
- Avicenne — bouton
- Firnas — lama
- Hypatie — étoile de mer
- Tesla — girafe
- Newton — dalmatien
- Galilée — koala
- Curie — crabe

Le nom Ophanim est réservé au compagnon ange, qui n’était pas présent dans l’archive source et reste à ajouter comme 17e compagnon.

## Personnage principal et style graphique

- Le personnage humain est désormais un sprite pixel-art cohérent avec les compagnons.
- Il est volontairement plus grand et placé au premier plan de la scène.
- Les quatre poses humaines sont fournies dans `wip-sprites/human/`.

## Personnalisation

- Les couleurs du personnage humain restent personnalisables : peau, cheveux, coiffure, haut et accessoire.
- Un curseur permet de modifier la teinte de tous les compagnons en même temps.
- Chaque compagnon possède maintenant son propre prénom, conservé individuellement lors du changement de sélection.
- Les profils sont conservés dans `localStorage`.
- Les états de session utilisent les poses correspondantes : Pause → sommeil, Je tricote → joie, Projet fini → action.

## Fichiers

- `index.html` : version autonome à publier sur GitHub Pages.
- `wip-sprites/` : sprites PNG individuels.


## Personnalisation de l’avatar
- Teintes de peau, couleurs de cheveux et de vêtements élargies.
- 21 coiffures et 9 coupes/tenues de base, dont un hijab en couche indépendante.
- Accessoires et couches de vêtements multi-sélectionnables et superposables ; les choix sont sauvegardés dans le profil local.
- Ophanim ajouté comme 17e compagnon à partir du sprite fourni, avec quatre poses (idle, happy, sleep, action).
