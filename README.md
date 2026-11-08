# Néon Rush

Une course sans fin sur trois voies dans une ville de nuit éclairée au néon : saute les barrières, glisse sous les panneaux, change de voie avant le métro et ramasse un maximum de pièces. La vitesse augmente à mesure que tu avances.

*English version: [README.en.md](README.en.md)*

## Commandes

- **← →** (ou **Q** / **D**) : changer de voie.
- **↑**, **Z**, **Espace** ou **Entrée** : sauter.
- **↓** ou **S** : glisser.
- **Souris** ou **doigt** : glisse dans la direction voulue (gauche, droite, haut pour sauter, bas pour glisser) ; un simple clic saute.
- **P** : pause.
- **Clic** ou **Espace** : lancer la course, puis en recommencer une après une chute.

## Obstacles

- **Barrière rayée** : saute par-dessus.
- **Panneau en hauteur** : glisse dessous.
- **Métro** : change de voie. Les métros aux phares allumés roulent vers toi, plus vite que les autres ; ils apparaissent après les premières centaines de mètres.

Au-dessus de chaque voie, un petit panneau annonce le prochain obstacle : **jaune** pour sauter, **cyan** pour glisser, **rouge** pour changer de voie. Il y a toujours au moins une voie libre de métro. Après une chute, le jeu dit ce qu'il fallait faire.

## Pièces et score

Les pièces arrivent en file sur une voie libre, ou en arc au-dessus d'une barrière, à attraper en sautant. Le score vaut la distance parcourue en mètres, plus 5 points par pièce. La vitesse augmente avec la distance, jusqu'au double de la vitesse de départ.

## Statistiques

Meilleur score, nombre de courses, pièces au total, plus de pièces en une course et distance totale parcourue.

## Données et synchronisation

Ton record et tes statistiques sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Néon Rush → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
