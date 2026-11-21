# Atelier avatar — bibliothèque de calques

- `hair/` : coiffures PNG alignées sur le canevas 288×512.
- `outfits/` : vêtements PNG alignés sur le canevas 288×512 et leurs miniatures.
- `accessories/` : accessoires PNG alignés sur le canevas 288×512 et leurs miniatures.
- `shoes/thumbs/` : miniatures pixel art de chaussures ajoutées à cette version.

Les chaussures sont ajoutées comme élément indépendant dans le profil (`shoes`) et affichées au niveau des pieds. Les options d'habits déjà raccordées au moteur utilisent les vrais calques raster listés dans `library.json`.


## Hijab
Le hijab est un choix exclusif de la catégorie `hair/`, au même titre qu’une coiffure. Il remplace les cheveux et utilise la palette de couleurs des cheveux. Il ne doit pas apparaître dans la sélection multiple des accessoires.
