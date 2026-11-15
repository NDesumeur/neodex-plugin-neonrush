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

## Bonus

De temps en temps, un bonus flotte au-dessus d'une voie libre :

- **Aimant** (10 s) : les pièces des trois voies viennent à toi.
- **Bouclier** (15 s) : une bulle te protège d'un choc, puis disparaît.
- **Planche à roulettes** (15 s) : tu sautes plus haut, et elle prend un choc à ta place.

Les bonus en cours s'affichent en haut à gauche, avec le temps qui reste (la barre clignote en rouge à la fin). Après un choc évité, tu clignotes un instant : rien ne peut te toucher.

## Les quartiers

La rue est bordée d'immeubles et change de quartier tous les 400 m ; le nouveau quartier arrive du fond de la rue :

- **Centre néon** : tours aux fenêtres allumées, enseignes roses et bleues, réverbères ;
- **Le port** : piles de conteneurs, quai en planches, grues et coucher de soleil sur la mer ;
- **Les toits** : course sur les toits, parapets, réservoirs d'eau et antennes, ciel étoilé et grosse lune ;
- **Le métro** : un tunnel carrelé avec ses néons, ses affiches, ses piliers, les rails et les traverses.

Le nom du quartier s'affiche quand tu y entres, puis on recommence au centre.

## Personnages

Tes pièces (celles de toutes tes courses) s'achètent des personnages dans la case **Personnages** : **Néo** (au départ), **Kiki la chatte** (150 pièces), **Robo** (400), **Ninja** (800) et **Étoile** (2 000). Une fois acheté, un personnage se choisit d'un clic.

## Plein écran

Le bouton **Plein écran** agrandit la course à tout l'écran (Échap pour en sortir). Hors plein écran, elle prend toute la hauteur que laisse la fenêtre.

## Pièces et score

Les pièces arrivent en file sur une voie libre, ou en arc au-dessus d'une barrière, à attraper en sautant. Le score vaut la distance parcourue en mètres, plus 5 points par pièce. La vitesse augmente avec la distance, jusqu'au double de la vitesse de départ.

## Statistiques

Meilleur score, nombre de courses, pièces au total, plus de pièces en une course et distance totale parcourue.

## Données et synchronisation

Ton record et tes statistiques sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Néon Rush → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
