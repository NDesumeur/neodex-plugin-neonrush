// Néon Rush : course sans fin sur une autoroute synthwave à trois voies : saute les lasers, glisse sous les barres, change de voie devant les camions, ramasse les pièces, réussis les missions.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Néon Rush</span><span class="hint">← → : voie · ↑ ou espace : saut · ↓ : glissade · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="nrCanvas" width="216" height="288"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="nrStats"></div></div>
      <div class="row"><button class="btn main" id="nrNew">NOUVELLE COURSE</button><button class="btn" id="nrFs">PLEIN ÉCRAN</button><button class="btn" id="nrMus">MUSIQUE</button></div>
      <div class="sysCard"><b>MISSIONS</b><div class="nrLvl" id="nrLvl"></div><div class="nrMis" id="nrMis"></div><div class="hint">Les trois missions réussies, ton multiplicateur de score monte d'un cran et trois nouvelles arrivent.</div></div>
      <div class="sysCard"><b>CHASSE DU JOUR</b><div class="nrWord" id="nrWord"></div><div class="hint">Les lettres du mot du jour apparaissent pendant les courses, une à la fois. Le mot complet rapporte 300 pièces. Un nouveau mot chaque jour.</div></div>
      <div class="sysCard"><b>PERSONNAGES</b><div class="nrWallet" id="nrWallet"></div><div class="nrChars" id="nrChars"></div></div>
      <div class="sysCard"><b>PLANCHES</b><div class="hint">Ta planche te sauve d'un choc par course, et garde son pouvoir tant qu'elle n'est pas cassée.</div><div class="nrChars" id="nrBoards"></div></div>
      <div class="hint">Laser rouge : saute. Barre jaune : glisse dessous. Camion : change de voie (ceux aux phares allumés foncent vers toi). Les obstacles arrivent sur le temps de la musique. Bonus : l'aimant attire les pièces des trois voies, le jetpack te fait voler au-dessus de tout, ×2 double les pièces.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:1 1 360px;min-width:min(100%,320px);position:relative}
.gameBox canvas{width:min(100%,max(280px,calc((100vh - 170px) * 3 / 4)));height:auto;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 3 / 4))}
.nrWallet{margin:6px 0 10px;color:#ffd84a}
.nrChars{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}
.nrChar{display:grid;justify-items:center;align-content:start;gap:5px;padding:8px 4px;background:#120a2a;box-shadow:inset 0 0 0 2px #3a2070;text-align:center;font-size:13px}
.nrChar.on{box-shadow:inset 0 0 0 2px #ff4fa8}
.nrPrice{color:#ffd84a;font-size:12px}
.nrPow{color:#3fe0ff;font-size:11px}
.nrChar canvas{image-rendering:pixelated}
.nrChar .btn{font-size:10px;padding:5px 6px;max-width:100%;white-space:nowrap}
.nrLvl{color:#ff4fa8;margin:6px 0}
.nrMis{display:grid;gap:8px;margin-bottom:6px}
.nrMisRow{display:grid;grid-template-columns:1fr auto;gap:2px 8px;font-size:13px}
.nrMisRow.done{color:#5aff9a}
.nrNum{color:#ffd84a}
.nrBar{grid-column:1/-1;height:4px;background:#120a2a;display:block}
.nrBar b{display:block;height:100%;background:#ff4fa8}
.nrMisRow.done .nrBar b{background:#5aff9a}
.nrWord{display:flex;gap:6px;margin:8px 0}
.nrWord span{width:26px;height:30px;display:grid;place-items:center;background:#120a2a;box-shadow:inset 0 0 0 2px #3a2070;color:#5a4a8a;font-size:16px}
.nrWord span.on{color:#fff4a0;box-shadow:inset 0 0 0 2px #b070ff;background:#2a1458}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{aspect-ratio:216/288}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'NÉON RUSH', T: { k: '#07021a', k2: '#120a2a', fill: '#1a1040', fillOn: '#2a1858', hl: '#3a2070', line: '#5a2f9a', acc: '#ff4fa8', accL: '#ffb0d8', accS: '#c02a7a', accD: '#4a0a2a',
  rivet: '#c8f8ff', btn: '#3a2070', btnHi: '#6a3fb0', btnLo: '#120a2a', btnHov: '#4a2a8a', btnHovHi: '#8a5ad0', text: '#f4ecff', muted: '#b8a8e0', acc2: '#3fe0ff', gold: '#ffd84a',
  orange: '#ff8a3a', red: '#ff4a5a', green: '#5aff9a', green2: '#1a8a5a', bg: '#0a0420', bgDot: '#1e1048', bgDot2: '#160a36', spark: '#3a2070', spark2: '#3fe0ff',
  tile: ['................', '..........:.....', '................', '...+............', '................', '................', '.............:..', '................',
    '................', '.....:..........', '................', '................', '..........+.....', '................', '..:.............', '................'] },
  emblem: ['....kkkk.....', '...kggggk....', '..kggggggk...', '..kggggggk...', '...kkggkk....', '..kssssssk...', '.kssssssssk..', 'kskssssssksk.', 'kgk.ssss.kgk.', '.k.kddddk.k..', '..kddkkddk...', '..kdk..kdk...', '..kgk..kgk...', '..kkk..kkk...'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(7,2,26,.88)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14); g.fillStyle = '#ff4fa8'; g.fillRect(0, y0 - 15, w, 1); g.fillRect(0, y0 + lines.length * 14, w, 1);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Néon Rush : une autoroute synthwave en vraie perspective. La caméra est au-dessus de la piste, derrière le coureur :
   un point (X, hauteur h, distance z) se dessine en x = centre + (X - caméra) * F / z, y = horizon + (CH - h) * F / z.
   Les rangées d'obstacles naissent au loin calées sur la musique : elles arrivent au coureur sur un temps fort. ---------- */
const NR = {W: 216, H: 288, HOR: 100, F: 48, CH: 64, PZ: 19.5, LW: 26, FAR: 260, BEAT: 30, BOX: 34, GATE: 10, BEAM: 12, JET: 40, ARCH: 80};
const nrs = gstore('neonrush', {runs: 0, coins: 0, bestCoins: 0, meters: 0});
nrs.wallet ??= nrs.coins; nrs.chars ??= ['neo']; nrs.char ??= 'neo'; nrs.bonus ??= 0; nrs.boards ??= ['bois']; nrs.board ??= 'bois'; nrs.music ??= true;
nrs.mis ??= {lvl: 0, set: null}; nrs.hunt ??= {day: -1, got: 0, words: 0};
let nr = null;
const nrCanvas = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return c; };
const nrRows = (rows, pal) => nrCanvas(rows[0].length, rows.length, g => sprite(g, rows, 0, 0, pal));
const nrMixC = new Map(), nrHex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
function nrMix(a, b, t) {  // le mélange de deux couleurs (32 paliers, gardés en mémoire) : le brouillard vers l'horizon
  const k = a + b + Math.round(Math.max(0, Math.min(1, t)) * 32); let v = nrMixC.get(k);
  if (!v) { const A = nrHex(a), B = nrHex(b), q = Math.round(Math.max(0, Math.min(1, t)) * 32) / 32; v = 'rgb(' + A.map((x, i) => Math.round(x + (B[i] - x) * q)).join(',') + ')'; nrMixC.set(k, v); }
  return v;
}
// le coureur, vu de dos : course (deux pas), saut, glissade ; chaque personnage a ses couleurs, un accessoire et un pouvoir
const NR_BACK = ['....kkkk....', '...khhhhk...', '..khhhhhhk..', '..khhhhhhk..', '..kHhhhhHk..', '...kkhhkk...', '..kjjjjjjk..', '.kjjjccjjjk.', '.kjjjccjjjk.', 'kskjjccjjksk', 'kskJJJJJJksk', '.k.kJJJJk.k.', '...kppppk...'];
const NR_LEGS = [['...kpkkpk...', '...kpk.kpk..', '...kpk.kwk..', '...kwk.kkk..', '...kkk......'], ['...kpkkpk...', '..kpk.kpk...', '..kwk.kpk...', '..kkk.kwk...', '......kkk...']];
const NR_TUCK = ['..kppppppk..', '..kwwkkwwk..', '..kkk..kkk..', '............', '............'];
const NR_DUCK = ['............', '............', '............', '............', '............', '............', '....kkkk....', '...khhhhk...', '..khhhhhhk..', '.kkjjccjjkk.', 'kskjjccjjksk', 'kskJJJJJJksk', '.kppkkkkppk.', '.kwwk..kwwk.', '.kkk....kkk.', '............', '............', '............'];
const NR_CHARS = [
  {id: 'neo', name: 'Néo', cost: 0, power: 'Aucun pouvoir', pal: {h: '#3fe0ff', H: '#1fa8d0', j: '#2a1458', J: '#1a0a3a', c: '#ff4fa8', p: '#3a3f8a', w: '#ffffff', s: '#ffc89a'}, top: ['............', '............']},
  {id: 'kiki', name: 'Kiki la chatte', cost: 150, power: 'Double saut', pal: {h: '#ff9a3c', H: '#c8641a', j: '#1a5a4a', J: '#0e3a30', c: '#5aff9a', p: '#2a5a4a', w: '#ffd84a', s: '#ffc89a'}, top: ['...k....k...', '..khk..khk..']},
  {id: 'robo', name: 'Robo', cost: 400, power: 'Bonus 50 % plus longs', pal: {h: '#c8ccec', H: '#8a90b8', j: '#4a5080', J: '#2a3060', c: '#3fe0ff', p: '#4a5080', w: '#3fe0ff', s: '#c8ccec'}, top: ['.....kk.....', '......k.....']},
  {id: 'ninja', name: 'Ninja', cost: 800, power: 'Part avec un bouclier', pal: {h: '#2a2a3a', H: '#14141e', j: '#2a2a3a', J: '#14141e', c: '#ff4a5a', p: '#2a2a3a', w: '#ff4a5a', s: '#ffc89a'}, top: ['............', '.........kk.']},
  {id: 'etoile', name: 'Étoile', cost: 2000, power: 'Score +25 %', pal: {h: '#ffd84a', H: '#c8a020', j: '#7a2a8a', J: '#4a1a5a', c: '#fff4a0', p: '#c8a020', w: '#ffffff', s: '#ffc89a'}, top: ['...k.kk.k...', '...kekkek...']}];
// les planches : elles te sauvent d'un choc par course, et gardent leur pouvoir tant qu'elles ne sont pas cassées
const NR_BOARDS = [{id: 'bois', name: 'Planche de bois', cost: 0, power: 'Te sauve d\'un choc', a: '#c8843a', b: '#7a4a1a'},
  {id: 'ressort', name: 'Ressort', cost: 300, power: 'Sauts plus hauts', a: '#5aff9a', b: '#1a8a5a'},
  {id: 'aimant', name: 'Aimantée', cost: 700, power: 'Attire les pièces voisines', a: '#ff4a5a', b: '#3a6aff'},
  {id: 'fusee', name: 'Fusée', cost: 1500, power: 'Départ en jetpack', a: '#ffd84a', b: '#ff4fa8'}];
const nrChar = () => NR_CHARS.find(c => c.id === nrs.char) || NR_CHARS[0], nrBoard = () => NR_BOARDS.find(b => b.id === nrs.board) || NR_BOARDS[0];
const nrSprC = {};
function nrSpr(id = nrs.char) {
  if (nrSprC[id]) return nrSprC[id];
  const c = NR_CHARS.find(c => c.id === id) || NR_CHARS[0], pal = {k: '#0a0418', e: '#ffd84a', ...c.pal}, body = c.top.concat(NR_BACK.slice(2)), dress = legs => nrRows(c.top.concat(NR_BACK.slice(2), legs), pal);
  return nrSprC[id] = {run: [dress(NR_LEGS[0]), dress(NR_LEGS[1])], jump: dress(NR_TUCK), duck: nrRows(NR_DUCK.map((r, i) => i === 6 ? (c.top[1].includes('k') ? c.top[1] : r) : r), pal), rows: body};
}
const NR_BOARD_ROWS = ['..kkkkkkkkkk..', '.kaaaaaaaaaaak', 'kbbbbbbbbbbbbk', '.kk.kkkkkk.kk.'];
const nrBoardImg = b => nrRows(NR_BOARD_ROWS, {k: '#0a0418', a: b.a, b: b.b});
const NR_ICONS = {mag: nrRows(['.kkk.kkk.', '.krk.kbk.', '.krk.kbk.', '.krk.kbk.', '.krkkkbk.', '.krrrbbk.', '..krrbk..', '...kkk...'], {k: '#0a0418', r: '#ff4a5a', b: '#3a6aff'}),
  jet: nrRows(['.kkk.kkk.', 'kwwkkkwwk', 'kggk.kggk', 'kggkkkggk', 'kggk.kggk', '.kk...kk.', '.oy...yo.', '..o...o..'], {k: '#0a0418', w: '#e8ecff', g: '#8a90b8', o: '#ff8a3a', y: '#ffd84a'}),
  x2: nrRows(['.........', 'w.w..www.', '.w.....w.', 'w.w..www.', '.....w...', '.....www.', '.........', '.........'], {w: '#ffffff'})};
const NR_BONUS = {mag: {name: 'Aimant', time: 600, c: '#ff4a5a'}, jet: {name: 'Jetpack', time: 420, c: '#ff8a3a'}, x2: {name: 'Pièces ×2', time: 600, c: '#5aff9a'}};
const NR_WHY = {gate: 'Il fallait sauter le laser', beam: 'Il fallait glisser sous la barre', block: 'Il fallait changer de voie'};
// le décor : ciel en bandes tramées, étoiles, ville et montagnes au néon (dessinés une fois)
const NR_SKY = nrCanvas(NR.W, NR.HOR, g => { const C = ['#0b0221', '#1a0538', '#2e0a52', '#4a0e66', '#701476', '#9a1a7a', '#c8247a', '#ff3a78'], bh = NR.HOR / C.length, r = seeded(3);
  for (let y = 0; y < NR.HOR; y++) { const f = y / bh, i = Math.min(C.length - 1, Math.floor(f)), t = f - i; px(g, C[i], 0, y, NR.W, 1);
    if (i + 1 < C.length && t > .55) for (let x = t > .8 ? y % 2 : (y % 2) * 2; x < NR.W; x += t > .8 ? 2 : 4) px(g, C[i + 1], x, y, 1, 1); }
  for (let i = 0; i < 46; i++) px(g, r() < .3 ? '#ffffff' : '#b8a8e0', Math.floor(r() * NR.W), Math.floor(r() * 50), 1, 1); });
const NR_CITY = nrCanvas(320, 46, g => { const r = seeded(9); let x = 0;
  while (x < 320) { const w = 5 + Math.floor(r() * 11), mid = 1 - Math.abs(x - 160) / 160, h = 6 + Math.floor(r() * (10 + mid * 12)); px(g, '#12042a', x, 46 - h, w, h);
    if (r() < .5) px(g, r() < .5 ? '#ff4fa8' : '#3fe0ff', x, 46 - h, w, 1);
    for (let wy = 46 - h + 3; wy < 44; wy += 3) for (let wx = x + 1; wx < x + w - 1; wx += 2) if (r() < .18) px(g, ['#ff4fa8', '#3fe0ff', '#ffd84a'][Math.floor(r() * 3)], wx, wy, 1, 1);
    if (r() < .2) px(g, '#ff4a5a', x + (w >> 1), 46 - h - 3, 1, 3);
    x += w + Math.floor(r() * 3); } });
const nrRidge = (seed, amp, dark, edge) => nrCanvas(320, 60, g => { const r = seeded(seed), pts = []; let v = .5;
  for (let x = 0; x < 320; x++) { v = Math.max(0, Math.min(1, v + (r() - .5) * .18)); if (x % 40 === 0) v = Math.max(v, r()); pts.push(v); }
  for (let x = 0; x < 320; x++) { const side = Math.min(1, Math.abs((x + 80) % 160 - 80) / 70), h = Math.round(4 + (pts[x] * .6 + .4) * amp * (.15 + .85 * side)); px(g, dark, x, 60 - h, 1, h); px(g, edge, x, 60 - h, 1, 1); } });
const NR_RIDGES = [nrRidge(21, 40, '#2a0a4a', '#ff4fa8'), nrRidge(33, 26, '#140530', '#3fe0ff')];
const nrSX = (X, z) => NR.W / 2 + (X - nr.cam) * NR.F / z, nrSY = (h, z) => NR.HOR + (NR.CH - h) * NR.F / z, nrLX = l => (l - 1) * NR.LW;
function nrNew() {
  nr = Object.assign(nr || {tick: 0, raf: 0}, {seen: nr ? nr.tick : 0, mode: 'ready', lane: 1, x: 0, cam: 0, e: 0, ve: 0, dj: false, duck: 0, obs: [], coins: [], items: [], letters: [], dist: 0, v: .55, t: 0, beat: -1, got: 0,
    shake: 0, record: false, dead: 0, step: 0, why: '', mag: 0, jet: 0, x2: 0, inv: 0, shield: nrs.char === 'ninja' ? 1 : 0, boardOn: true, msg: null, jetLane: 1, letterAt: 500 + Math.random() * 900, lastM: 0, dirty: false,
    flash: 0, lit: 0, noRows: false, jetStart: nrs.board === 'fusee'});
}
let nrac = null, nrNoise = null, nrMute = false;
function nrBeep(f, d, type = 'square', slide = 0, vol = .045) { if (nrMute) return; try { nrac ??= new AudioContext(); const o = nrac.createOscillator(), g = nrac.createGain(), t = nrac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(nrac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
// la musique synthwave : un pas tous les quart de temps (7,5 images), joué par la boucle du jeu, donc calé sur les obstacles ; elle s'étoffe avec la distance
const NR_PROG = [[110, 220, [0, 3, 7, 12]], [87.31, 174.6, [0, 4, 7, 12]], [130.8, 261.6, [0, 4, 7, 12]], [98, 196, [0, 4, 7, 12]]];  // la mineur, fa, do, sol
function nrNote(f, d, type, vol, at, cut) { const o = nrac.createOscillator(), g = nrac.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0001, at + d);
  if (cut) { const fl = nrac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = cut; o.connect(fl).connect(g); } else o.connect(g); g.connect(nrac.destination); o.start(at); o.stop(at + d + .02); }
function nrHitNoise(at, d, vol, hp) { nrNoise ??= (() => { const b = nrac.createBuffer(1, nrac.sampleRate * .3, nrac.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; return b; })();
  const s = nrac.createBufferSource(), g = nrac.createGain(), fl = nrac.createBiquadFilter(); s.buffer = nrNoise; fl.type = 'highpass'; fl.frequency.value = hp; g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0001, at + d); s.connect(fl).connect(g).connect(nrac.destination); s.start(at); s.stop(at + d + .02); }
function nrMusic(step) {
  if (nrMute || !nrs.music || !view.classList.contains('on')) return;
  try { nrac ??= new AudioContext(); if (nrac.state === 'suspended') nrac.resume(); } catch { return; }
  const at = nrac.currentTime + .03, s = step % 16, [bass, lead, ch] = NR_PROG[Math.floor(step / 16) % 4], m = nr.dist / 4;
  if (s % 4 === 0) { const o = nrac.createOscillator(), g = nrac.createGain(); o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(40, at + .12); g.gain.setValueAtTime(.16, at); g.gain.exponentialRampToValueAtTime(.0001, at + .16); o.connect(g).connect(nrac.destination); o.start(at); o.stop(at + .2); }
  if (s === 4 || s === 12) nrHitNoise(at, .14, .06, 1400);
  if (s % 2 === 0) nrNote(bass * (s % 4 ? 2 : 1), .12, 'sawtooth', .05, at, 520);
  if (m > 150 && s % 2 === 1) nrHitNoise(at, .03, .025, 7000);
  if (m > 300 && s % 2 === 0) nrNote(lead * 2 ** (ch[(s >> 1) % 4] / 12), .1, 'square', .014, at);
  if (s === 0) nrNote(lead / 2 * 2 ** (ch[1] / 12), 1.8, 'triangle', .02, at);
}
function nrStart() { if (nr.mode === 'ready') { nr.mode = 'play'; nrs.runs++; saveGames(); if (nr.jetStart) { nr.jet = 180; nr.jetStart = false; } } else if (nr.mode === 'pause') nr.mode = 'play'; else if (nr.mode === 'over' && nr.dead > 40) nrNew(); }
function nrAct(a) {
  if (nr.mode !== 'play') { nrStart(); return; }
  if (a === 'L' && nr.lane > 0) { nr.lane--; nrBeep(330, .05); nrMis('lane', 1); }
  if (a === 'R' && nr.lane < 2) { nr.lane++; nrBeep(330, .05); nrMis('lane', 1); }
  if (a === 'U' && !nr.jet) {
    if (nr.e === 0) { nr.ve = nrs.board === 'ressort' && nr.boardOn ? 3.05 : 2.65; nr.duck = 0; nrBeep(440, .12, 'square', 880); }
    else if (nrs.char === 'kiki' && !nr.dj) { nr.dj = true; nr.ve = 2.4; nrBeep(660, .12, 'square', 1320); }
  }
  if (a === 'D' && !nr.jet) { if (nr.e > 0) nr.ve = Math.min(nr.ve, -3.5); nr.duck = 40; nrBeep(200, .1, 'triangle', 120); }
}
// une rangée d'obstacles au loin ; il reste toujours une voie sans camion ; dans une voie libre, des pièces ou, parfois, un bonus
function nrRow(z) {
  const blockIn = l => nr.obs.some(o => o.type === 'block' && o.lane === l && o.z + o.len > z - 8), hard = Math.min(1, nr.dist / 8000);
  const free = [0, 1, 2].filter(l => !blockIn(l)), n = Math.random() < .3 + hard * .35 ? 2 : 1, lanes = free.sort(() => Math.random() - .5).slice(0, Math.min(n, free.length));
  let blocks = 3 - free.length;
  for (const l of lanes) {
    let type = ['gate', 'beam', 'block'][Math.floor(Math.random() * 3)];
    if (type === 'block' && blocks >= 2) type = 'gate';
    if (type === 'block') { blocks++; nr.obs.push({type, lane: l, z, len: 30 + Math.random() * 40, vz: Math.random() < .12 + hard * .25 && nr.dist > 600 ? .35 : 0}); }
    else nr.obs.push({type, lane: l, z, len: 2, vz: 0});
  }
  const open = [0, 1, 2].filter(l => !lanes.includes(l) && !blockIn(l));
  if (open.length && Math.random() < .7) {
    const l = open[Math.floor(Math.random() * open.length)];
    if (nr.dist > 100 && Math.random() < .08) nr.items.push({type: ['mag', 'jet', 'x2'][Math.floor(Math.random() * 3)], lane: l, z: z + 6});
    else for (let i = 0; i < 6; i++) nr.coins.push({lane: l, z: z + i * 5, h: 0});
  } else { const o = nr.obs.at(-1); if (o && o.type === 'gate' && Math.random() < .6) for (let i = 0; i < 5; i++) nr.coins.push({lane: o.lane, z: o.z - 8 + i * 4.5, h: 18 - Math.abs(i - 2) * 6}); }
}
// les missions : trois à la fois ; les trois réussies, le multiplicateur de score monte d'un cran et trois nouvelles arrivent
const NR_MIS = [['gate', 'Sauter des lasers', 10, 5], ['beam', 'Glisser sous des barres', 8, 4], ['coins', 'Pièces en une course', 60, 30, 1], ['lane', 'Changer de voie', 40, 20],
  ['meters', 'Mètres en une course', 400, 200, 1], ['bonus', 'Attraper des bonus', 3, 2], ['jet', 'Voler en jetpack', 1, 1], ['score', 'Points en une course', 1500, 900, 1]];
function nrMisSet() { const m = nrs.mis; if (!m.set) m.set = [0, 1, 2].map(i => { const j = (m.lvl * 3 + i) % NR_MIS.length; return {j, n: NR_MIS[j][2] + NR_MIS[j][3] * Math.floor(m.lvl / 2), p: 0, done: false}; }); }
function nrMis(k, v) {  // v : ce qu'on ajoute (missions en tout) ou la valeur de la course en cours (missions « en une course »)
  const m = nrs.mis; nrMisSet();
  for (const s of m.set) { const M = NR_MIS[s.j]; if (s.done || M[0] !== k) continue; s.p = M[4] ? Math.max(s.p, v) : s.p + v; nr.dirty = true;
    if (s.p >= s.n) { s.p = s.n; s.done = true; nr.msg = {text: 'MISSION RÉUSSIE', sub: M[1], t: 120}; nrBeep(784, .15, 'square', 1568); } }
  if (m.set.every(s => s.done)) { m.lvl++; m.set = null; nrMisSet(); nr.msg = {text: 'MULTIPLICATEUR ×' + (m.lvl + 1), sub: 'trois nouvelles missions', t: 150}; [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => nrBeep(f, .15), i * 90)); saveGames(); }
}
// la chasse du jour : un mot, une lettre à la fois au fil des courses ; le mot complet rapporte 300 pièces
const NR_WORDS = ['NEON', 'RUSH', 'SYNTH', 'LASER', 'TURBO', 'PIXEL', 'RETRO', 'DISCO', 'COMET', 'NIGHT', 'ORBIT', 'VOLT'];
const nrDay = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
function nrWord() { const h = nrs.hunt, d = nrDay(); if (h.day !== d) { h.day = d; h.got = 0; } return NR_WORDS[d % NR_WORDS.length]; }
const nrMeters = () => Math.floor(nr.dist / 4);
const nrScore = () => Math.floor(nrMeters() * (nrs.mis.lvl + 1) * (nrs.char === 'etoile' ? 1.25 : 1)) + nr.got * 5;
function nrHit() {
  nr.mode = 'over'; nr.shake = 14; nr.dead = 0; nrBeep(160, .4, 'sawtooth', 40);
  const score = nrScore(); nr.record = best('neonrush', score); nrMis('score', score); nrMis('meters', nrMeters());
  nrs.coins += nr.got; nrs.wallet += nr.got; nrs.bestCoins = Math.max(nrs.bestCoins, nr.got); nrs.meters += nrMeters(); nrs.bestMeters = Math.max(nrs.bestMeters || 0, nrMeters()); saveGames(); nrInfo(); nrShop();
}
function nrUpdate() {
  if (nr.shake) nr.shake--;
  nr.cam += (nr.x * .55 - nr.cam) * .15;
  if (nr.mode === 'ready') { nr.dist += .3; return; }
  if (nr.mode === 'over') { nr.dead++; return; }
  nr.t++; if (nr.t % 7.5 < 1) nrMusic(Math.floor(nr.t / 7.5));
  const bonusT = k => NR_BONUS[k].time * (nrs.char === 'robo' ? 1.5 : 1);
  nr.v = .55 + Math.min(.55, nr.dist / 9000); nr.dist += nr.v; nr.step += nr.v;
  nr.x += (nrLX(nr.lane) - nr.x) * .3; if (Math.abs(nrLX(nr.lane) - nr.x) < .3) nr.x = nrLX(nr.lane);
  if (nr.jet) { nr.jet--; nr.e += (NR.JET - nr.e) * .08; nr.ve = 0; if (!nr.jet) { nr.inv = 60; nr.ve = -.5; } }
  else if (nr.e > 0 || nr.ve > 0) { nr.e += nr.ve; nr.ve -= .16; if (nr.e <= 0) { nr.e = 0; nr.ve = 0; nr.dj = false; } }
  if (nr.duck) nr.duck--;
  for (const k of ['mag', 'x2', 'inv', 'flash']) if (nr[k] > 0) nr[k]--;
  if (nr.msg && --nr.msg.t <= 0) nr.msg = null;
  // une rangée naît quand son arrivée au coureur tombe sur un temps fort (un temps sur deux)
  const D = NR.FAR - NR.PZ, arrive = nr.t + D / Math.min(1.1, nr.v + D / 18000), bi = Math.floor(arrive / NR.BEAT);  // la vitesse moyenne du trajet : elle monte un peu en route
  if (bi !== nr.beat && !nr.noRows) { nr.beat = bi;
    if (nr.jet > 60) { if (bi % 2 === 0) { nr.jetLane = Math.max(0, Math.min(2, nr.jetLane + Math.floor(Math.random() * 3) - 1)); for (let i = 0; i < 6; i++) nr.coins.push({lane: nr.jetLane, z: NR.FAR + i * 5, h: NR.JET}); } }
    else if (bi % 2 === 0) nrRow(NR.FAR - (arrive - bi * NR.BEAT) * nr.v + nr.v); }
  for (const o of nr.obs) o.z -= nr.v + o.vz;
  for (const c of nr.coins) c.z -= nr.v;
  for (const it of nr.items) it.z -= nr.v;
  for (const L of nr.letters) L.z -= nr.v;
  // la lettre du jour : elle arrive dans une voie sans camion
  const word = nrWord();
  if (nrs.hunt.got < word.length && nr.dist + NR.FAR >= nr.letterAt) { const ok = [0, 1, 2].filter(l => !nr.obs.some(o => o.lane === l && o.z < NR.FAR + 8 && o.z + o.len > NR.FAR - 8));
    if (ok.length) { nr.letters.push({lane: ok[Math.floor(Math.random() * ok.length)], z: NR.FAR, ch: word[nrs.hunt.got]}); nr.letterAt = nr.dist + NR.FAR + 900 + Math.random() * 900; } else nr.letterAt += 20; }
  const lane = Math.round(nr.x / NR.LW + 1);
  for (const o of nr.obs) {
    if (!o.counted && o.z + o.len < NR.PZ - 1.5) { o.counted = true; if (o.lane === lane && !nr.jet && o.type !== 'block') nrMis(o.type, 1); }
    if (o.lane !== lane || o.z > NR.PZ + 1.5 || o.z + o.len < NR.PZ - 1.5) continue;
    const hit = o.type === 'block' ? nr.e < NR.BOX : o.type === 'gate' ? nr.e < NR.GATE : !(nr.duck && nr.e < 6) && nr.e < 20;
    if (!hit || nr.inv || nr.jet) continue;
    if (nr.shield) { nr.shield = 0; nr.inv = 90; nr.shake = 6; nr.msg = {text: 'BOUCLIER !', sub: 'il a pris le choc', t: 70}; nrBeep(520, .25, 'sawtooth', 180); continue; }
    if (nr.boardOn) { nr.boardOn = false; nr.inv = 90; nr.shake = 6; nr.msg = {text: 'PLANCHE CASSÉE', sub: 'elle t\'a sauvé', t: 80}; nrBeep(520, .25, 'sawtooth', 180); continue; }
    nr.why = NR_WHY[o.type]; return nrHit();
  }
  // l'aimant attire les pièces des trois voies ; la planche aimantée, celles des voies voisines, de plus près
  const pull = nr.mag ? 70 : nrs.board === 'aimant' && nr.boardOn ? 22 : 0;
  if (pull) for (const c of nr.coins) if (c.z < NR.PZ + pull && c.z > NR.PZ - 2 && (nr.mag || Math.abs(c.lane - nr.x / NR.LW - 1) < 1.5)) { c.lane += (nr.x / NR.LW + 1 - c.lane) * .25; c.h += (nr.e - c.h) * .25; c.z -= (c.z - NR.PZ) * .12; }
  for (const c of nr.coins) if (!c.got && Math.abs(nrLX(c.lane) - nr.x) < 10 && Math.abs(c.z - NR.PZ) < 2.4 && Math.abs(c.h - nr.e) < 14) { c.got = true; nr.got += nr.x2 ? 2 : 1; nr.lit = 8; nrBeep(1320, .06, 'square', 1760, .03); nrMis('coins', nr.got); }
  for (const it of nr.items) if (!it.got && it.lane === lane && Math.abs(it.z - NR.PZ) < 2.4 && Math.abs(nr.e - 6) < 20) { it.got = true; nr[it.type] = bonusT(it.type); nrs.bonus++; nrBeep(880, .3, 'triangle', 1760); nrMis('bonus', 1); if (it.type === 'jet') nrMis('jet', 1); nr.msg = {text: NR_BONUS[it.type].name.toUpperCase(), sub: '', t: 60}; }
  for (const L of nr.letters) if (!L.got && L.lane === lane && Math.abs(L.z - NR.PZ) < 2.4 && Math.abs(nr.e - 8) < 22) { L.got = true; nrs.hunt.got++; nr.flash = 20; nrBeep(988, .25, 'triangle', 1976);
    if (nrs.hunt.got >= word.length) { nrs.wallet += 300; nrs.hunt.words++; nr.msg = {text: 'MOT DU JOUR : ' + word, sub: '+300 pièces', t: 160}; } else nr.msg = {text: 'LETTRE ' + L.ch, sub: word.slice(0, nrs.hunt.got) + '·'.repeat(word.length - nrs.hunt.got), t: 90}; saveGames(); nr.dirty = true; }
  if (nr.t - nr.lastM >= 60) { nr.lastM = nr.t; nrMis('meters', nrMeters()); nrMis('score', nrScore()); if (nr.dirty) { nr.dirty = false; nrMisUI(); } }
  nr.obs = nr.obs.filter(o => o.z + o.len > 2); nr.coins = nr.coins.filter(c => !c.got && c.z > 2); nr.items = nr.items.filter(i => !i.got && i.z > 2); nr.letters = nr.letters.filter(L => !L.got && L.z > 2);
}
// le dessin : formes en perspective, bords au néon
const nrP = (X, h, z) => [nrSX(X, z), nrSY(h, z)];
function nrPoly(g, pts, fill, line, lw = 1) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (line) { g.strokeStyle = line; g.lineWidth = lw; g.stroke(); } }
function nrBox(g, X0, X1, z0, z1, h, face, top, side, edge) {  // une boîte : côtés visibles, dessus, puis la face avant
  z0 = Math.max(z0, 4); z1 = Math.min(z1, NR.FAR); if (z1 <= z0) return; const lw = Math.max(1, NR.F / z0 * .5);
  if (nr.cam < X0) nrPoly(g, [nrP(X0, 0, z0), nrP(X0, h, z0), nrP(X0, h, z1), nrP(X0, 0, z1)], side, edge, lw);
  if (nr.cam > X1) nrPoly(g, [nrP(X1, 0, z0), nrP(X1, h, z0), nrP(X1, h, z1), nrP(X1, 0, z1)], side, edge, lw);
  nrPoly(g, [nrP(X0, h, z0), nrP(X1, h, z0), nrP(X1, h, z1), nrP(X0, h, z1)], top, edge, lw);
  nrPoly(g, [nrP(X0, 0, z0), nrP(X1, 0, z0), nrP(X1, h, z0), nrP(X0, h, z0)], face, edge, lw);
}
const nrFade = z => Math.max(0, Math.min(1, (NR.FAR - z) / 40));
function nrDrawObs(g, o) {
  const X = nrLX(o.lane), s = NR.F / Math.max(4, o.z); g.globalAlpha = nrFade(o.z);
  if (o.type === 'block') {
    const hot = o.vz > 0, edge = hot ? '#ff8a3a' : '#ff4fa8';
    nrBox(g, X - 11, X + 11, o.z, o.z + o.len, NR.BOX, '#1a0a3a', '#2e1660', '#120628', edge);
    if (o.z > 4) { const [x0, y0] = nrP(X - 9, 22, o.z), [x1] = nrP(X + 9, 22, o.z); px(g, hot ? '#ffd84a' : '#3fe0ff', x0, y0, x1 - x0, Math.max(1, s * .6));
      const [a0, b0] = nrP(X - 9, 14, o.z); px(g, '#3a1a70', a0, b0, x1 - x0, Math.max(1, s * .5));
      if (hot) for (const dx of [-7, 5]) { const [hx, hy] = nrP(X + dx, 6, o.z); px(g, '#fff4a0', hx, hy, Math.max(1, s * 2), Math.max(1, s * 1.5)); } }
  } else if (o.type === 'gate') {
    const z = Math.max(4, o.z), [l, yb] = nrP(X - 11, 0, z), [r] = nrP(X + 11, 0, z), yt = nrSY(NR.GATE, z), pw = Math.max(1, s * 1.2);
    g.fillStyle = 'rgba(255,58,74,.16)'; g.fillRect(l, yt, r - l, yb - yt);
    px(g, '#2a1450', l - pw, yt, pw, yb - yt); px(g, '#2a1450', r, yt, pw, yb - yt);
    for (const h of [3.5, 8]) { const y = nrSY(h, z), th = Math.max(1, s * .7); g.fillStyle = 'rgba(255,58,74,.35)'; g.fillRect(l, y - th, r - l, th * 3); px(g, nr.tick % 8 < 4 ? '#ff3a4a' : '#ff8a8a', l, y, r - l, th); }
  } else {
    const z = Math.max(4, o.z), [l, yb] = nrP(X - 12, 0, z), [r] = nrP(X + 12, 0, z), y0 = nrSY(19, z), y1 = nrSY(NR.BEAM, z), pw = Math.max(1, s * 1.2);
    px(g, '#2a1450', l - pw, y0, pw, yb - y0); px(g, '#2a1450', r, y0, pw, yb - y0);
    g.fillStyle = 'rgba(255,216,74,.25)'; g.fillRect(l - pw, y0 - pw, r - l + pw * 2, y1 - y0 + pw * 2); px(g, '#ffd84a', l, y0, r - l, y1 - y0);
    const st = Math.max(2, Math.round(s * 3)); for (let x = l + ((nr.tick >> 2) % 2) * st; x < r - st / 2; x += st * 2) px(g, '#1a0a3a', x, y0, Math.min(st, r - x), y1 - y0);
  }
  g.globalAlpha = 1;
}
function nrDrawCoin(g, c) {
  const s = NR.F / c.z, [x, y] = nrP(nrLX(c.lane), c.h + 5, c.z), r = Math.max(1, 3 * s), w = Math.max(.5, r * Math.abs(Math.cos(nr.tick / 8 + c.z * .08)));
  g.globalAlpha = nrFade(c.z); nrPoly(g, [[x, y - r], [x + w, y], [x, y + r], [x - w, y]], '#ffd84a', s > 1.2 ? '#fff4a0' : null); if (s > 1.5) px(g, '#ffffff', x - 1, y - r * .5, 1, 1); g.globalAlpha = 1;
}
function nrDrawItem(g, it, icon, color, label) {
  const s = NR.F / it.z, [x, y] = nrP(nrLX(it.lane), 10 + Math.sin(nr.tick / 10) * 2, it.z), r = Math.max(2, 6 * s);
  g.globalAlpha = nrFade(it.z); g.fillStyle = color + '55'; g.beginPath(); g.arc(x, y, r * 1.3, 0, 6.283); g.fill(); g.fillStyle = '#0a0418'; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.strokeStyle = color; g.lineWidth = Math.max(1, s * .5); g.stroke();
  if (icon) { const k = s * .55; g.drawImage(icon, Math.round(x - icon.width * k / 2), Math.round(y - icon.height * k / 2), Math.round(icon.width * k), Math.round(icon.height * k)); }
  if (label && s > .9) pxFont(g, label, x, y + 4 * Math.min(2, s * .6), '#fff4a0', s > 2 ? 12 : 8, 'center');
  g.globalAlpha = 1;
}
function nrDraw() {
  const g = nr.g, {W, H, HOR} = NR, cx = W / 2;
  for (; nr.seen < nr.tick; nr.seen++) if (nr.mode !== 'play') nrUpdate();
  g.imageSmoothingEnabled = false; g.save();
  if (nr.shake) g.translate(Math.round((Math.random() - .5) * nr.shake), Math.round((Math.random() - .5) * nr.shake));
  // le ciel, le soleil rayé, la ville en ombre devant lui, les montagnes au néon
  g.drawImage(NR_SKY, 0, 0);
  for (let i = 0; i < 6; i++) if ((nr.tick + i * 37) % 90 < 20) px(g, '#ffffff', (i * 71 + 13) % W, (i * 23 + 5) % 44, 1, 1);
  const sx = cx - nr.cam * .15, R = 38, sy = HOR - 2;
  for (let dy = -R; dy <= 0; dy++) { const y = sy + dy, w = Math.sqrt(R * R - dy * dy), k = (dy + R) / R;
    if (k > .45 && ((dy + R) + nr.tick * .2) % 7 < 1 + (k - .45) * 7) continue;
    px(g, nrMix('#fff27a', '#ff2a8a', k), sx - w, y, w * 2, 1); }
  const wrap = (img, off, y) => { const o = ((off % 320) + 320) % 320; g.drawImage(img, -o, y); g.drawImage(img, 320 - o, y); };
  wrap(NR_CITY, 52 + nr.cam * .25, HOR - 46); wrap(NR_RIDGES[0], 52 + nr.cam * .4 + nr.dist * .01, HOR - 60); wrap(NR_RIDGES[1], 52 + nr.cam * .6 + nr.dist * .02, HOR - 60);
  // le sol, ligne par ligne : grille au néon qui défile, piste sombre, tirets roses, rails cyan
  for (let y = HOR; y < H; y++) {
    const z = NR.CH * NR.F / (y - HOR + .5), s = NR.F / z, wz = z + nr.dist, fog = Math.min(1, z / NR.FAR) ** .55, half = 1.5 * NR.LW * s, tx = cx - nr.cam * s;
    px(g, nrMix('#0d0322', '#3a0a52', fog), 0, y, W, 1);
    const dz = z * z / (NR.CH * NR.F), gl = nrMix('#ff3aa8', '#4a0e60', fog);
    if (Math.floor(wz / 13) !== Math.floor((wz + dz) / 13)) px(g, gl, 0, y, W, 1);
    else for (let k = 0; k <= 14; k++) for (const sg of [-1, 1]) { const x = cx + (sg * (1.5 * NR.LW + 6 + k * 13) - nr.cam) * s; if (x >= 0 && x < W) px(g, gl, x, y, 1, 1); }
    px(g, nrMix(Math.floor(wz / 8) % 2 ? '#170a32' : '#140828', '#3a0a52', fog), tx - half, y, half * 2, 1);
    const lw = Math.max(1, Math.round(s * .9));
    if ((wz / 12) % 1 < .5) for (const sg of [-1, 1]) px(g, nrMix('#ff4fa8', '#4a0e60', fog), tx + sg * NR.LW / 2 * s - lw / 2, y, lw, 1);
    for (const sg of [-1, 1]) { const rx = tx + sg * half - (sg > 0 ? lw : 0); px(g, nrMix('#1a6a9a', '#3a0a52', fog), rx + sg * lw, y, lw, 1); px(g, nrMix('#7ff4ff', '#4a0e60', fog), rx, y, lw, 1); }
  }
  // de chaque côté, des pylônes lumineux ; de loin en loin, une arche au-dessus de la route ; puis les obstacles, du plus loin au plus proche
  const list = [];
  for (let n = Math.ceil((nr.dist + 4) / 20); n * 20 - nr.dist < NR.FAR; n++) { const z = n * 20 - nr.dist; list.push([z, () => {
    const s = NR.F / z; g.globalAlpha = nrFade(z);
    for (const sg of [-1, 1]) { const X = sg * (1.5 * NR.LW + 12), [x, y0] = nrP(X, 0, z), y1 = nrSY(30, z), w = Math.max(1, s * 1.2), lc = (n + (sg > 0)) % 2 ? '#ff4fa8' : '#3fe0ff';
      px(g, '#2a1450', x - w / 2, y1, w, y0 - y1); px(g, lc, x - w * 1.2, y1 - w * 2, w * 2.4, w * 2.4); }
    if (n % 10 === 0) { const [l, yb] = nrP(-1.5 * NR.LW - 5, 0, z), [r] = nrP(1.5 * NR.LW + 5, 0, z), yt = nrSY(NR.ARCH, z), w = Math.max(1, s * 2), c = (n / 10) % 2 ? '#ff4fa8' : '#3fe0ff';
      px(g, '#1a0a3a', l - w, yt, w, yb - yt); px(g, '#1a0a3a', r, yt, w, yb - yt); px(g, c, l - w, yt, w * .4 + 1, yb - yt); px(g, c, r + w * .6, yt, w * .4 + 1, yb - yt); px(g, '#1a0a3a', l - w, yt - w, r - l + 2 * w, w * 1.5); px(g, c, l - w, yt - w, r - l + 2 * w, Math.max(1, w * .4)); }
    g.globalAlpha = 1; }]); }
  for (const o of nr.obs) list.push([Math.max(4, o.z), () => nrDrawObs(g, o)]);
  for (const c of nr.coins) list.push([c.z, () => nrDrawCoin(g, c)]);
  for (const it of nr.items) list.push([it.z, () => nrDrawItem(g, it, NR_ICONS[it.type], NR_BONUS[it.type].c)]);
  for (const L of nr.letters) list.push([L.z, () => nrDrawItem(g, L, null, '#b070ff', L.ch)]);
  // le coureur : ombre au sol, planche, corps, flammes du jetpack, bulle du bouclier
  const sp = nrSpr(), body = nr.mode === 'over' || (nr.duck && nr.e < 6) ? sp.duck : nr.e > 0 && !nr.jet ? sp.jump : sp.run[Math.floor(nr.step / 5) % 2];
  list.push([NR.PZ, () => {
    const [x, gy] = nrP(nr.x, 0, NR.PZ), y = Math.round(nrSY(nr.e, NR.PZ)), K = 2, bw = body.width * K, bh = body.height * K, sh = Math.max(4, 14 - nr.e / 4);
    g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(Math.round(x - sh), Math.round(gy - 2), Math.round(sh * 2), 3);
    if (nr.inv && (nr.tick >> 2) % 2) return;
    const lift = nr.boardOn ? 6 : 0;
    if (nr.boardOn) { const bi = nrBoardImgC[nrs.board] ??= nrBoardImg(nrBoard()); g.drawImage(bi, Math.round(x - bi.width), y - bi.height * 2 + 2, bi.width * 2, bi.height * 2); }
    if (nr.jet) { px(g, '#8a90b8', x - 7, y - bh + 14 - lift, 4, 12); px(g, '#8a90b8', x + 3, y - bh + 14 - lift, 4, 12); const f = 4 + (nr.tick % 4); px(g, '#ff8a3a', x - 7, y + 3 - lift, 4, f); px(g, '#ff8a3a', x + 3, y + 3 - lift, 4, f); px(g, '#ffd84a', x - 6, y + 3 - lift, 2, f - 2); px(g, '#ffd84a', x + 4, y + 3 - lift, 2, f - 2); }
    g.drawImage(body, Math.round(x - bw / 2), y - bh - lift, bw, bh);
    if (nr.shield) { g.strokeStyle = (nr.tick >> 3) % 2 ? '#3fe0ff' : '#c8f8ff'; g.lineWidth = 1; g.beginPath(); g.arc(x, y - bh / 2 - lift, bh * .62, 0, 6.283); g.stroke(); }
    if (nr.lit) { g.fillStyle = 'rgba(255,216,74,' + (nr.lit / 30).toFixed(2) + ')'; g.beginPath(); g.arc(x, y - bh / 2 - lift, 12, 0, 6.283); g.fill(); }
  }]);
  list.sort((a, b) => b[0] - a[0]).forEach(([, f]) => f());
  // les traits de vitesse
  if (nr.mode === 'play' && nr.v > .7) for (let i = 0; i < 4; i++) { const k = (nr.tick * 9 + i * 61) % 100 / 100, side = i % 2 ? 1 : -1, x = cx + side * (40 + k * 90), y = HOR + 30 + k * 150; px(g, 'rgba(200,248,255,.5)', x, y, 1, 4 + k * 10); }
  g.restore();
  if (nr.flash) { g.fillStyle = 'rgba(176,112,255,' + (nr.flash / 60).toFixed(2) + ')'; g.fillRect(0, 0, W, H); }
  // le bandeau du haut : score, multiplicateur, pièces, bonus en cours
  if (nr.mode !== 'ready') {
    px(g, 'rgba(7,2,26,.72)', 0, 0, W, 22); px(g, '#ff4fa8', 0, 22, W, 1);
    pxFont(g, String(nrScore()), 6, 16, '#ffffff', 12); pxFont(g, '×' + (nrs.mis.lvl + 1), 6, 32, '#ff4fa8', 8);
    nrPoly(g, [[W - 40, 6], [W - 35, 11], [W - 40, 16], [W - 45, 11]], '#ffd84a', '#fff4a0'); pxFont(g, String(nr.got), W - 30, 16, '#ffd84a', 12);
    let bx = W - 34; for (const k of ['mag', 'jet', 'x2']) if (nr[k] > 0 || (k === 'jet' && nr.jet)) { const left = nr[k], full = NR_BONUS[k].time * (nrs.char === 'robo' ? 1.5 : 1); g.drawImage(NR_ICONS[k], bx, 27, 18, 16);
      px(g, '#07021a', bx, 45, 26, 4); px(g, left < 120 && nr.tick % 10 < 5 ? '#ff4a5a' : NR_BONUS[k].c, bx + 1, 46, Math.ceil(24 * Math.min(1, left / full)), 2); bx -= 30; }
  }
  if (nr.msg && nr.mode === 'play') { const y = 56; px(g, 'rgba(7,2,26,.8)', 0, y, W, nr.msg.sub ? 30 : 18); px(g, '#ff4fa8', 0, y, W, 1); pxFont(g, nr.msg.text, cx, y + 13, '#ffd84a', 8, 'center'); if (nr.msg.sub) pxFont(g, nr.msg.sub, cx, y + 25, '#c8f8ff', 8, 'center'); }
  if (nr.mode === 'over') { g.fillStyle = `rgba(255,40,90,${Math.max(0, .35 - nr.dead / 60)})`; g.fillRect(0, 0, W, H); }
  if (nr.mode === 'ready') gameText(g, W, [['NÉON RUSH', '#ff4fa8', 16], ['Clic ou espace pour courir', '#ffffff'], ['← → voies · ↑ saut · ↓ glisse', '#b8a8e0'], ['Laser rouge : saute', '#ff8a8a'], ['Barre jaune : glisse', '#ffd84a'], ['Camion : change de voie', '#3fe0ff'], ['Record ' + (games.best.neonrush || 0), '#ffd84a']], 116);
  if (nr.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace pour reprendre', '#b8a8e0']], 130);
  if (nr.mode === 'over' && nr.dead > 20) gameText(g, W, [['BOUM !', '#ff4a5a', 14], ['Score ' + nrScore(), '#ffffff'], [nr.why || '', '#ffb0b8'], ['Pièces ' + nr.got + ' · ' + nrMeters() + ' m', '#ffd84a'], [nr.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.neonrush || 0), '#3fe0ff'], [nr.dead > 40 ? 'Espace pour recommencer' : '', '#b8a8e0']], 110);
}
const nrBoardImgC = {};
function nrInfo() {
  setTimeout(nrTrophies);
  $('nrStats').replaceChildren(...[['Meilleur score', games.best.neonrush || 0], ['Courses', nrs.runs], ['Pièces au total', nrs.coins], ['Plus de pièces en une course', nrs.bestCoins], ['Bonus ramassés', nrs.bonus], ['Mots du jour trouvés', nrs.hunt.words], ['Distance totale', nrs.meters + ' m']].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
  nrMisUI();
}
function nrMisUI() {
  nrMisSet(); $('nrLvl').textContent = 'Multiplicateur de score : ×' + (nrs.mis.lvl + 1);
  $('nrMis').replaceChildren(...nrs.mis.set.map(s => { const M = NR_MIS[s.j], row = el('div', 'nrMisRow' + (s.done ? ' done' : '')), bar = el('i', 'nrBar'), fill = el('b', ''); fill.style.width = Math.round(100 * s.p / s.n) + '%'; bar.append(fill);
    row.append(el('span', '', M[1]), el('span', 'nrNum', s.done ? 'OK' : s.p + ' / ' + s.n), bar); return row; }));
  const w = nrWord(); $('nrWord').replaceChildren(...[...w].map((ch, i) => el('span', i < nrs.hunt.got ? 'on' : '', ch)));
}
// la boutique : personnages et planches à acheter avec les pièces gagnées, puis à choisir
function nrShopList(box, list, owned, cur, preview, pick) {
  box.replaceChildren(...list.map(c => {
    const own = owned.includes(c.id), on = cur === c.id, card = el('div', 'nrChar' + (on ? ' on' : '')), im = preview(c), pv = el('canvas');
    pv.width = im.width; pv.height = im.height; pv.getContext('2d').drawImage(im, 0, 0); pv.style.width = im.width * 3 + 'px'; pv.style.height = im.height * 3 + 'px';
    const b = el('button', 'btn' + (own ? '' : ' main'), on ? 'CHOISI' : own ? 'CHOISIR' : 'ACHETER'); b.disabled = on || (!own && nrs.wallet < c.cost);
    b.onclick = () => { if (!own) { if (nrs.wallet < c.cost) return; nrs.wallet -= c.cost; owned.push(c.id); toast(c.name + ' : à toi !'); nrBeep(990, .3, 'triangle', 1980); } pick(c.id); saveGames(); nrShop(); nrInfo(); };
    card.append(pv, el('span', '', c.name), el('span', 'nrPow', c.power), el('span', 'nrPrice', own ? 'à toi' : c.cost + ' pièces'), b); return card;
  }));
}
function nrShop() {
  $('nrWallet').textContent = 'Pièces à dépenser : ' + nrs.wallet;
  nrShopList($('nrChars'), NR_CHARS, nrs.chars, nrs.char, c => nrSpr(c.id).run[0], id => { nrs.char = id; if (nr?.mode === 'ready') nr.shield = id === 'ninja' ? 1 : 0; });
  nrShopList($('nrBoards'), NR_BOARDS, nrs.boards, nrs.board, b => nrBoardImgC[b.id] ??= nrBoardImg(b), id => { nrs.board = id; if (nr?.mode === 'ready') nr.jetStart = id === 'fusee'; });
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !nr || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.repeat) return;
  const a = {ArrowLeft: 'L', a: 'L', q: 'L', ArrowRight: 'R', d: 'R', ArrowUp: 'U', w: 'U', z: 'U', ' ': 'U', ArrowDown: 'D', s: 'D', Enter: 'U'}[e.key.length === 1 ? e.key.toLowerCase() : e.key];
  if (a) { e.preventDefault(); nrAct(a); }
  if (e.key.toLowerCase() === 'p' && nr.mode === 'play') nr.mode = 'pause';
});
{ let p0 = null; const c = $('nrCanvas');  // glisser du doigt ou de la souris ; un simple clic saute
  c.onpointerdown = e => { e.preventDefault(); p0 = [e.clientX, e.clientY]; };
  c.onpointerup = e => { if (!p0 || !nr) return; const dx = e.clientX - p0[0], dy = e.clientY - p0[1]; p0 = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return nrAct('U');
    nrAct(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'L' : 'R') : (dy < 0 ? 'U' : 'D')); }; }
$('nrNew').onclick = () => { nrNew(); $('nrNew').blur(); };
$('nrFs').onclick = () => { $('nrFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else $('nrCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
const nrMusBtn = () => { $('nrMus').textContent = 'MUSIQUE : ' + (nrs.music ? 'OUI' : 'NON'); };
$('nrMus').onclick = () => { nrs.music = !nrs.music; saveGames(); nrMusBtn(); $('nrMus').blur(); }; nrMusBtn();
function nrCheck() {  // vérification : perspective, obstacles, voie libre, bonus, planche, bouclier, missions, chasse du jour, rangées calées sur le temps, boutique
  const keep = nr, realBest = games.best.neonrush, realStats = JSON.stringify(nrs), bad = [], one = (type, extra = {}) => { nrNew(); nr.mode = 'play'; nr.boardOn = false; nr.shield = 0; nr.noRows = true; nr.obs = [{type, lane: 1, z: NR.PZ + .5, len: type === 'block' ? 40 : 2, vz: 0}]; Object.assign(nr, extra); nrUpdate(); return nr.mode; };
  nrMute = true; nr = null; nrNew(); if (Math.abs(nrSY(0, NR.PZ) - 257.5) > 1 || Math.abs(nrSX(NR.LW, NR.PZ) - nrSX(0, NR.PZ) - 64) > 1) bad.push('perspective');
  if (one('gate') !== 'over' || nr.why !== NR_WHY.gate) bad.push('le laser ne tue pas'); if (one('gate', {e: 12, ve: .5}) !== 'play') bad.push('le saut ne passe pas le laser');
  if (one('beam') !== 'over') bad.push('la barre ne tue pas'); if (one('beam', {duck: 30}) !== 'play') bad.push('la glissade ne passe pas la barre');
  if (one('block', {e: 30, ve: 0}) !== 'over') bad.push('le camion ne tue pas'); if (one('block', {jet: 200, e: NR.JET}) !== 'play') bad.push('le jetpack ne passe pas au-dessus');
  if (one('block', {boardOn: true}) !== 'play' || nr.boardOn) bad.push('la planche ne sauve pas'); for (let i = 0; i < 20; i++) nrUpdate(); if (nr.mode !== 'play') bad.push('pas de répit après la planche');
  if (one('gate', {shield: 1, boardOn: true}) !== 'play' || nr.shield || !nr.boardOn) bad.push('le bouclier passe avant la planche');
  nrNew(); for (let i = 0; i < 300; i++) nrRow(NR.FAR); if ([0, 1, 2].every(l => nr.obs.some(o => o.type === 'block' && o.lane === l && o.z === NR.FAR))) bad.push('trois camions de front');
  nrNew(); nr.mode = 'play'; nr.boardOn = false; nr.mag = 600; nr.noRows = true; nr.coins = [{lane: 0, z: NR.PZ + 20, h: 0}, {lane: 2, z: NR.PZ + 30, h: 0}]; for (let t = 0; t < 80; t++) nrUpdate(); if (nr.got !== 2) bad.push('l\'aimant n\'attire pas (' + nr.got + ')');
  nrNew(); nr.mode = 'play'; nr.x2 = 100; nr.noRows = true; nr.coins = [{lane: 1, z: NR.PZ + .3, h: 0}]; nrUpdate(); if (nr.got !== 2) bad.push('pièces ×2');
  nrNew(); nr.mode = 'play'; nr.noRows = true; nr.items = [{type: 'jet', lane: 1, z: NR.PZ + .3}]; nrUpdate(); if (!nr.jet) bad.push('le jetpack ne se ramasse pas'); for (let t = 0; t < 120; t++) nrUpdate(); if (Math.abs(nr.e - NR.JET) > 3) bad.push('le jetpack ne vole pas (' + Math.round(nr.e) + ')');
  // les rangées arrivent sur un temps fort
  nrNew(); nr.mode = 'play'; nr.boardOn = false; nr.inv = 1e9; let arr = [];
  for (let t = 0; t < 900; t++) { nrUpdate(); for (const o of nr.obs) { o.born ??= nr.t; if (!o.hit && o.vz === 0 && o.z <= NR.PZ) { o.hit = true; arr.push(nr.t); } } }
  if (!arr.length || arr.some(t => { const k = t % NR.BEAT; return Math.min(k, NR.BEAT - k) > 2; })) bad.push('rangées pas calées sur le temps : ' + arr.slice(0, 5).map(t => t % NR.BEAT));
  // les personnages : double saut de Kiki, bouclier du Ninja ; la planche ressort saute plus haut
  nrs.char = 'kiki'; nrNew(); nr.mode = 'play'; nrAct('U'); nrUpdate(); nrAct('U'); if (!nr.dj || nr.ve !== 2.4) bad.push('double saut');
  nrs.char = 'neo'; nrNew(); nr.mode = 'play'; nrAct('U'); nrUpdate(); const v1 = nr.ve; nrAct('U'); if (nr.ve !== v1) bad.push('saut en l\'air sans pouvoir');
  nrs.char = 'ninja'; nrNew(); if (nr.shield !== 1) bad.push('bouclier du ninja'); nrs.char = 'neo';
  nrs.board = 'ressort'; nrNew(); nr.mode = 'play'; nrAct('U'); if (nr.ve !== 3.05) bad.push('planche ressort'); nrs.board = 'bois';
  // les missions : trois, différentes ; les trois réussies, le multiplicateur monte
  nrs.mis = {lvl: 0, set: null}; nrNew(); nr.mode = 'play'; nrMisSet(); const ks = nrs.mis.set.map(s => NR_MIS[s.j][0]); if (new Set(ks).size !== 3) bad.push('missions');
  for (const s of nrs.mis.set) { const M = NR_MIS[s.j]; nrMis(M[0], M[4] ? s.n : s.n); } if (nrs.mis.lvl !== 1 || nrs.mis.set.some(s => s.done)) bad.push('multiplicateur ' + nrs.mis.lvl);
  nr.got = 0; nr.dist = 400; if (nrScore() !== 200) bad.push('score ×2 : ' + nrScore());
  // la chasse du jour : une lettre ramassée avance le mot ; le mot complet rapporte 300 pièces
  nrs.hunt = {day: nrDay(), got: 0, words: 0}; const w = nrWord(); nrs.wallet = 0; nrNew(); nr.mode = 'play'; nr.noRows = true;
  for (let i = 0; i < w.length; i++) { nr.letters = [{lane: 1, z: NR.PZ + .3, ch: w[i]}]; nrUpdate(); } if (nrs.hunt.got !== w.length || nrs.wallet !== 300 || nrs.hunt.words !== 1) bad.push('chasse du jour ' + nrs.hunt.got + ' ' + nrs.wallet);
  nrNew(); nr.mode = 'play'; nr.noRows = true; nr.dist = 1000; nr.letterAt = 0; nrUpdate(); if (nr.letters.length) bad.push('lettre après le mot complet');
  for (const c of NR_CHARS) { const s = nrSpr(c.id); if ([...s.run, s.jump, s.duck].some(im => im.width !== 12 || im.height !== 18)) bad.push('images de ' + c.name); }
  if ([...NR_BACK, ...NR_LEGS.flat(), ...NR_TUCK, ...NR_DUCK, ...NR_CHARS.flatMap(c => c.top)].some(r => r.length !== 12)) bad.push('largeur des images');
  nrs.wallet = 160; nrs.chars = ['neo']; nrs.char = 'neo';
  const buy = id => { const c = NR_CHARS.find(c => c.id === id); if (nrs.wallet >= c.cost) { nrs.wallet -= c.cost; nrs.chars.push(id); nrs.char = id; return true; } return false; };
  if (!buy('kiki') || nrs.wallet !== 10 || buy('robo') || nrs.char !== 'kiki') bad.push('la boutique compte mal');
  if (realBest === undefined) delete games.best.neonrush; else games.best.neonrush = realBest; const real = JSON.parse(realStats); for (const k of Object.keys(nrs)) if (!(k in real)) delete nrs[k]; Object.assign(nrs, real);
  nr = keep; nrMute = false; return bad.length ? bad.join(', ') : 'ok';
}
{ const r = nrCheck(); console.assert(r === 'ok', 'neonrush', r); $('nrCanvas').__nr = {st: () => nr, check: nrCheck, act: nrAct, give: k => { nr[k] = NR_BONUS[k].time; }, go: m => { nr.dist = m * 4; }, shop: nrShop, nrs}; }
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function nrTrophies() {
  const b = games.best.neonrush, x = nrs.mis.lvl + 1, sig = [b, nrs.runs, nrs.meters, nrs.coins, nrs.bestCoins, x, nrs.hunt.words].join(); if (sig === nrTrophies.sig) return; nrTrophies.sig = sig;
  trophyRecord('score', b || null); trophyRecord('pieces', nrs.bestCoins || null);
  if (nrs.runs >= 1) trophy('premier'); if (nrs.bestMeters >= 1000) trophy('km1'); if (nrs.meters >= 50000) trophy('km50');
  if (nrs.bestCoins >= 100) trophy('pieces100'); if (nrs.coins >= 5000) trophy('pieces'); if (x >= 5) trophy('multi5'); if (x >= 10) trophy('multi10'); if (nrs.hunt.words >= 10) trophy('mots');
}
ctx.onOpen(() => {
  if (!nr || !nr.g) { nrNew(); nr.g = $('nrCanvas').getContext('2d'); }
  gameLoop(nr, 'neonrush', nrUpdate, nrDraw); nrInfo(); nrShop();
});
}
