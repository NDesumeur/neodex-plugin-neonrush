# Néon Rush (Neon Rush)

An endless three-lane run through a neon-lit city at night: jump over barriers, slide under signs, switch lanes before the subway train and grab as many coins as you can. The speed rises as you go.

*Version française : [README.md](README.md)*

## Controls

- **← →** (or **A** / **D**, **Q** on AZERTY): switch lanes.
- **↑**, **W** (**Z** on AZERTY), **Space** or **Enter**: jump.
- **↓** or **S**: slide.
- **Mouse** or **finger**: swipe in the direction you want (left, right, up to jump, down to slide); a simple click jumps.
- **P**: pause.
- **Click** or **Space**: start the run, then start another one after a fall.

## Obstacles

- **Striped barrier**: jump over it.
- **Overhead sign**: slide under it.
- **Subway train**: switch lanes. Trains with their headlights on drive towards you, faster than the others; they appear after the first few hundred metres.

Above each lane, a small sign announces the next obstacle: **yellow** to jump, **cyan** to slide, **red** to switch lanes. There is always at least one lane free of trains. After a fall, the game tells you what you should have done.

## Bonuses

From time to time, a bonus floats above a free lane:

- **Magnet** (10 s): the coins of all three lanes come to you.
- **Shield** (15 s): a bubble protects you from one crash, then disappears.
- **Skateboard** (15 s): you jump higher, and it takes a crash for you.

Active bonuses show at the top left, with the time left (the bar flashes red at the end). After an avoided crash you blink for a moment: nothing can hit you.

## Districts

The street is lined with buildings and changes district every 400 m; the new district comes from the end of the street:

- **Neon centre**: towers with lit windows, pink and blue signs, street lamps;
- **The harbour**: stacks of containers, a plank quay, cranes and a sunset over the sea;
- **The rooftops**: a run on the roofs, parapets, water towers and antennas, a starry sky and a big moon;
- **The subway**: a tiled tunnel with its neon lights, posters, pillars, rails and sleepers.

The district's name shows when you enter it, then it starts again at the centre.

## Characters

Your coins (from all your runs) buy characters in the **Characters** box: **Néo** (at the start), **Kiki the cat** (150 coins), **Robo** (400), **Ninja** (800) and **Étoile** (2,000). Once bought, a character is chosen with a click.

## Full screen

The **Full screen** button fills the whole screen with the run (Escape to leave). Otherwise it takes all the height the window leaves.

## Coins and score

Coins come in a line on a free lane, or in an arc above a barrier, to catch while jumping. The score is the distance run in metres, plus 5 points per coin. The speed rises with distance, up to twice the starting speed.

## Statistics

Best score, number of runs, total coins, most coins in one run and total distance run.

## Data and sync

Your record and statistics are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Néon Rush → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
