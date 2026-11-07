// Néon Rush : Course sans fin sur trois voies dans une ville néon : saute les barrières, glisse sous les panneaux, change de voie avant le métro, ramasse les pièces.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Néon Rush</span><span class="hint">← → : voie · ↑ ou espace : saut · ↓ : glissade · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="nrCanvas" width="216" height="288"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="nrStats"></div></div>
      <div class="row"><button class="btn main" id="nrNew">NOUVELLE COURSE</button></div>
      <div class="hint">Barrière rayée : saute. Panneau en hauteur : glisse dessous. Métro : change de voie. Les métros aux phares allumés roulent vers toi.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{max-width:460px;aspect-ratio:216/288}`;
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

/* ---------- Néon Rush : route en fausse 3D (une ligne d'écran = une distance), objets triés du plus loin au plus proche ---------- */
const NR = {W: 216, H: 288, HOR: 74, PZ: 1.6, LANE: 78, U: 3.4, FAR: 26};
const nrs = gstore('neonrush', {runs: 0, coins: 0, bestCoins: 0, meters: 0});
let nr = null;
const nrCanvas = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return c; };
const nrRows = (rows, pal, flip) => nrCanvas(rows[0].length, rows.length, g => sprite(g, flip ? rows.map(r => [...r].reverse().join('')) : rows, 0, 0, pal));
// le coureur, vu de dos : capuche cyan, veste rose
const NR_PAL = {k: '#120a2a', h: '#3fe0ff', H: '#1fa8d0', j: '#ff4fa8', J: '#c02a7a', s: '#ffc89a', p: '#3a3f8a', w: '#ffffff'};
const NR_RUN = ['....kkkk....', '...khhhhk...', '..khhhhhhk..', '..khHhhhhk..', '..khhhhHhk..', '...kkhhkk...', '..kjjjjjjk..', '.kjjjjJjjjk.', '.kjjjJjjjjk.', 'kjkjjjjjjkjk', 'ksk.jjjj.ksk',
  '.k.kppppk.k.', '...kppppk...', '..kppkkppk..', '..kpk..kpk..', '..kpk...kk..', '..kwwk......', '..kkkk......'];
const NR_JUMP = NR_RUN.slice(0, 13).concat(['..kppppppk..', '..kwwkkwwk..', '..kkk..kkk..', '............', '............']);
const NR_DUCK = ['....kkkk....', '...khhhhk...', '..khhhhhhk..', '..khHhhhhk..', '.kkjjjjjjkk.', 'kjjjjJjjjjjk', 'kskjjjjjjksk', '.kppppppppk.', 'kwwk....kwwk', 'kkkk....kkkk'];
function nrTrain(dark, lit) {
  const P = dark ? {k: '#07021a', b: '#6a72a8', B: '#4a5080', g: '#1a5a7a', s: '#c02a7a', l: '#ff4a5a'} : {k: '#07021a', b: '#d8dcf0', B: '#9aa3c8', g: '#2ac8e8', s: '#ff4fa8', l: lit ? '#fff4a0' : '#ff8a3a'};
  return nrCanvas(20, 26, g => {
    px(g, P.k, 2, 0, 16, 1); px(g, P.k, 0, 2, 20, 24); px(g, P.k, 1, 1, 18, 1); px(g, P.b, 1, 2, 18, 23); px(g, P.b, 2, 1, 16, 1); px(g, P.B, 1, 20, 18, 5);
    px(g, P.k, 3, 5, 14, 8); px(g, P.g, 4, 6, 12, 6); if (!dark) { px(g, '#c8f8ff', 5, 7, 3, 1); px(g, '#c8f8ff', 5, 8, 1, 2); }
    px(g, P.s, 1, 14, 18, 2); px(g, P.l, 3, 17, 3, 2); px(g, P.l, 14, 17, 3, 2); px(g, P.k, 6, 22, 8, 2);
  });
}
const NR_SPR = {
  run: nrRows(NR_RUN, NR_PAL), run2: nrRows(NR_RUN, NR_PAL, true), jump: nrRows(NR_JUMP, NR_PAL), duck: nrRows(NR_DUCK, NR_PAL),
  barrier: nrCanvas(22, 14, g => { px(g, '#07021a', 0, 0, 22, 9); for (let y = 1; y < 8; y++) for (let x = 1; x < 21; x++) px(g, (x + y) % 6 < 3 ? '#ffd84a' : '#ff4fa8', x, y); px(g, '#fff4a0', 1, 1, 20, 1);
    for (const x of [2, 17]) { px(g, '#07021a', x, 9, 3, 5); px(g, '#c8ccec', x + 1, 9, 1, 5); } }),
  bar: nrCanvas(22, 24, g => { for (const x of [0, 19]) { px(g, '#07021a', x, 0, 3, 24); px(g, '#c8f8ff', x + 1, 0, 1, 24); } px(g, '#07021a', 0, 0, 22, 11); px(g, '#3fe0ff', 1, 1, 20, 9); px(g, '#c8f8ff', 1, 1, 20, 1); px(g, '#1fa8d0', 1, 9, 20, 1);
    for (const x of [5, 11, 17]) { px(g, '#07021a', x - 1, 2, 2, 4); px(g, '#07021a', x - 3, 5, 6, 1); px(g, '#07021a', x - 2, 6, 4, 1); px(g, '#07021a', x - 1, 7, 2, 1); } }),
  train: nrTrain(false, false), trainLit: nrTrain(false, true), trainBack: nrTrain(true),
  coin: [7, 5, 3, 1].map(w => nrCanvas(7, 7, g => { const x = (7 - w) >> 1; px(g, '#07021a', x, 0, w, 7); if (w > 2) { px(g, '#ffd84a', x + 1, 1, w - 2, 5); px(g, '#fff4a0', x + 1, 1, 1, 3); } else px(g, '#ffd84a', x, 1, w, 5); })),
  lamp: nrCanvas(6, 34, g => { px(g, '#07021a', 2, 4, 2, 30); px(g, '#5a5f8a', 2, 4, 1, 30); px(g, '#07021a', 0, 0, 6, 5); px(g, '#3fe0ff', 1, 1, 4, 3); px(g, '#c8f8ff', 2, 1, 2, 1); }),
};
// ce qu'il faut faire, affiché au bas de chaque voie pour son prochain obstacle : sauter, glisser, changer de voie
const NR_HINT_PAL = {k: '#07021a', y: '#ffd84a', Y: '#fff4a0', c: '#3fe0ff', C: '#c8f8ff', r: '#ff4a5a', R: '#ffb0b8'};
const NR_HINT = {
  barrier: nrRows(['...kkkk...', '..kyYYyk..', '.kyyYYyyk.', 'kyyyYYyyyk', 'kkkyyyykkk', '..kyyyyk..', '..kyyyyk..', '..kyyyyk..', '..kkkkkk..'], NR_HINT_PAL),
  bar: nrRows(['..kkkkkk..', '..kccCck..', '..kccCck..', '..kccCck..', 'kkkccCckkk', 'kcccCCccck', '.kccCCcck.', '..kcCCck..', '...kkkk...'], NR_HINT_PAL),
  train: nrRows(['kkk....kkk', 'krRk..kRrk', '.krRkkRrk.', '..krRRrk..', '...kRRk...', '..krRRrk..', '.krRkkRrk.', 'krRk..kRrk', 'kkk....kkk'], NR_HINT_PAL),
};
const NR_WHY = {barrier: 'Il fallait sauter la barrière', bar: 'Il fallait glisser sous le panneau', train: 'Il fallait changer de voie'};
// la ville au loin : dessinée une fois (fenêtres allumées au hasard, toujours les mêmes)
const NR_CITY = nrCanvas(320, 60, g => { const r = seeded(7); let x = 0; while (x < 320) { const w = 14 + Math.floor(r() * 22), h = 18 + Math.floor(r() * 40), c = r() < .5 ? '#1a1040' : '#22145a'; px(g, '#07021a', x, 60 - h - 1, w + 1, h + 1); px(g, c, x + 1, 60 - h, w - 1, h);
  for (let wy = 60 - h + 3; wy < 58; wy += 4) for (let wx = x + 3; wx < x + w - 2; wx += 4) if (r() < .35) px(g, r() < .6 ? '#ffd84a' : '#3fe0ff', wx, wy, 2, 2);
  if (r() < .3) { px(g, '#ff4fa8', x + 3, 60 - h + 2, w - 6, 2); } x += w + Math.floor(r() * 3); } });
function nrNew() {
  nr = Object.assign(nr || {tick: 0, raf: 0}, {seen: nr ? nr.tick : 0, mode: 'ready', lane: 1, x: 1, e: 0, ve: 0, duck: 0, obs: [], coins: [], deco: [], dist: 0, v: .11, spawn: 2, got: 0, shake: 0, record: false, dead: 0, step: 0, why: ''});
  for (let z = 2; z < NR.FAR; z += 3) nr.deco.push({z});
}
let nrac = null;
function nrBeep(f, d, type = 'square', slide = 0) { try { nrac ??= new AudioContext(); const o = nrac.createOscillator(), g = nrac.createGain(), t = nrac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(.045, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(nrac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function nrStart() { if (nr.mode === 'ready') { nr.mode = 'play'; nrs.runs++; saveGames(); } else if (nr.mode === 'pause') nr.mode = 'play'; else if (nr.mode === 'over' && nr.dead > 40) nrNew(); }
function nrAct(a) {
  if (nr.mode !== 'play') { nrStart(); return; }
  if (a === 'L' && nr.lane > 0) { nr.lane--; nrBeep(330, .05); }
  if (a === 'R' && nr.lane < 2) { nr.lane++; nrBeep(330, .05); }
  if (a === 'U' && nr.e === 0) { nr.ve = 8; nr.duck = 0; nrBeep(440, .12, 'square', 880); }
  if (a === 'D') { if (nr.e > 0) nr.ve = Math.min(nr.ve, -8); nr.duck = 38; nrBeep(200, .1, 'triangle', 120); }
}
// une rangée d'obstacles au loin ; il reste toujours une voie sans métro
function nrRow(z) {
  const trainIn = l => nr.obs.some(o => o.type === 'train' && o.lane === l && o.z + o.len > z - 1.5);
  const free = [0, 1, 2].filter(l => !trainIn(l)), n = Math.random() < .45 ? 2 : 1;
  const lanes = free.sort(() => Math.random() - .5).slice(0, Math.min(n, free.length));
  let trains = 3 - free.length;
  for (const l of lanes) {
    let type = ['barrier', 'bar', 'train'][Math.floor(Math.random() * 3)];
    if (type === 'train' && trains >= 2) type = 'barrier';
    if (type === 'train') { trains++; nr.obs.push({type, lane: l, z, len: 3 + Math.random() * 4, vz: Math.random() < .3 && nr.dist > 40 ? .05 : 0}); }
    else nr.obs.push({type, lane: l, z, len: .35, vz: 0});
  }
  const open = [0, 1, 2].filter(l => !lanes.includes(l) && !trainIn(l));
  if (open.length && Math.random() < .75) { const l = open[Math.floor(Math.random() * open.length)]; for (let i = 0; i < 5; i++) nr.coins.push({lane: l, z: z + i * .7, e: 0}); }
  else if (Math.random() < .5) { const o = nr.obs.at(-1); if (o && o.type === 'barrier') for (let i = 0; i < 3; i++) nr.coins.push({lane: o.lane, z: o.z - .7 + i * .7, e: 50 - Math.abs(i - 1) * 12}); }
}
function nrHit() {
  nr.mode = 'over'; nr.shake = 14; nr.dead = 0; nrBeep(160, .4, 'sawtooth', 40);
  const score = nrScore(); nr.record = best('neonrush', score);
  nrs.coins += nr.got; nrs.bestCoins = Math.max(nrs.bestCoins, nr.got); nrs.meters += Math.floor(nr.dist * 3); saveGames(); nrInfo();
}
const nrScore = () => Math.floor(nr.dist * 3) + nr.got * 5;
function nrUpdate() {
  if (nr.shake) nr.shake--;
  if (nr.mode === 'ready') { nr.dist += .03; return; }
  if (nr.mode === 'over') { nr.dead++; return; }
  nr.v = .11 + Math.min(.11, nr.dist / 2500); nr.dist += nr.v; nr.step += nr.v;
  nr.x += (nr.lane - nr.x) * .3; if (Math.abs(nr.lane - nr.x) < .02) nr.x = nr.lane;
  if (nr.e > 0 || nr.ve > 0) { nr.e += nr.ve; nr.ve -= .45; if (nr.e <= 0) { nr.e = 0; nr.ve = 0; } }
  if (nr.duck) nr.duck--;
  for (const o of nr.obs) o.z -= nr.v + o.vz;
  for (const c of nr.coins) c.z -= nr.v;
  for (const d of nr.deco) { d.z -= nr.v; if (d.z < .5) d.z += NR.FAR - 2; }
  nr.spawn -= nr.v; if (nr.spawn <= 0) { nrRow(NR.FAR); nr.spawn = 6 - Math.min(1.6, nr.dist / 600); }
  const lane = Math.round(nr.x), near = (z, len) => z <= NR.PZ + .2 && z + len >= NR.PZ - .2;
  for (const o of nr.obs) if (o.lane === lane && near(o.z, o.len)) {
    if (o.type === 'train' || o.type === 'barrier' && nr.e < 34 || o.type === 'bar' && !nr.duck) { nr.why = NR_WHY[o.type]; nrHit(); return; }
  }
  for (const c of nr.coins) if (!c.got && c.lane === lane && Math.abs(c.z - NR.PZ) < .3 && Math.abs(c.e - nr.e) < 40) { c.got = true; nr.got++; nrBeep(1320, .06, 'square', 1760); }
  nr.obs = nr.obs.filter(o => o.z + o.len > .6); nr.coins = nr.coins.filter(c => !c.got && c.z > .6);
}
const nrY = z => NR.HOR + (NR.H - NR.HOR) / z;
function nrPut(g, img, z, lane, e = 0, alpha = 1) {  // un sprite posé au sol à la distance z, centré sur sa voie
  const s = NR.U / z, w = img.width * s, h = img.height * s, x = NR.W / 2 + (lane - 1) * NR.LANE / z - w / 2, y = nrY(z) - h - e / z;
  g.globalAlpha = alpha * Math.max(0, Math.min(1, (NR.FAR - z) / 5)); g.drawImage(img, Math.round(x), Math.round(y), Math.round(w), Math.round(h)); g.globalAlpha = 1;
}
function nrDraw() {
  const g = nr.g, {W, H, HOR} = NR;
  for (; nr.seen < nr.tick; nr.seen++) if (nr.mode !== 'play') nrUpdate();
  g.imageSmoothingEnabled = false; g.save();
  if (nr.shake) g.translate(Math.round((Math.random() - .5) * nr.shake), Math.round((Math.random() - .5) * nr.shake));
  // ciel en bandes, lune, ville (légère parallaxe quand on change de voie)
  const SKY = ['#07021a', '#0e0530', '#160840', '#22104e', '#34145a', '#4a1a62'];
  SKY.forEach((c, i) => px(g, c, 0, i * HOR / SKY.length, W, HOR / SKY.length + 1));
  for (let i = 0; i < 24; i++) px(g, i % 5 ? '#b8a8e0' : '#ffffff', (i * 53 + 7) % W, (i * 29) % 40, 1, 1);
  px(g, '#fff4e0', 160, 12, 12, 12); px(g, '#ffd8b0', 168, 12, 4, 12); px(g, '#07021a', 158, 14, 2, 8); px(g, '#07021a', 172, 14, 2, 8);
  g.drawImage(NR_CITY, Math.round(-52 - (nr.x - 1) * 10 - (nr.dist * .5) % 1), HOR - 58);
  // la route, ligne par ligne : bandes qui défilent, lignes de voie en tirets, rails néon
  for (let y = HOR + 1; y < H; y++) {
    const z = (H - HOR) / (y - HOR), s = 1 / z, wz = z + nr.dist, half = NR.LANE * 1.5 * s, cx = W / 2;
    px(g, Math.floor(wz * .8) % 2 ? '#07021a' : '#0b0424', 0, y, W, 1);
    px(g, Math.floor(wz * 1.2) % 2 ? '#3a3070' : '#43397c', cx - half, y, half * 2, 1);
    const lw = Math.max(1, Math.round(4 * s));
    if (Math.floor(wz * 1.6) % 2) for (const k of [-1, 1]) px(g, '#c8b8ff', cx + k * NR.LANE / 2 * s - lw / 2, y, lw, 1);
    for (const k of [-1, 1]) { px(g, '#07021a', cx + k * half - (k > 0 ? lw + 1 : -1), y, lw + 1, 1); px(g, '#ff4fa8', cx + k * half - (k > 0 ? lw : 0), y, lw, 1); }
  }
  // les objets, du plus loin au plus proche (le coureur compris)
  const items = [];
  for (const d of nr.deco) for (const l of [-.7, 2.7]) items.push([d.z, () => nrPut(g, NR_SPR.lamp, d.z, l)]);
  for (const o of nr.obs) {
    if (o.type !== 'train') { items.push([o.z, () => nrPut(g, NR_SPR[o.type], o.z, o.lane)]); continue; }
    for (let z = Math.min(o.z + o.len, NR.FAR); z > Math.max(o.z, 1.25) + .01; z -= .3) items.push([z, () => nrPut(g, NR_SPR.trainBack, z, o.lane)]);
    if (o.z > 1.25) items.push([o.z - .01, () => nrPut(g, o.vz ? NR_SPR.trainLit : NR_SPR.train, o.z, o.lane)]);
  }
  const cf = Math.floor(nr.tick / 6) % 6;
  for (const c of nr.coins) items.push([c.z, () => nrPut(g, NR_SPR.coin[[0, 1, 2, 3, 2, 1][cf]], c.z, c.lane, c.e)]);
  const body = nr.mode === 'over' ? NR_SPR.duck : nr.duck ? NR_SPR.duck : nr.e > 0 ? NR_SPR.jump : Math.floor(nr.step * 2.2) % 2 ? NR_SPR.run : NR_SPR.run2;
  items.push([NR.PZ, () => { const s = NR.U / NR.PZ; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(Math.round(W / 2 + (nr.x - 1) * NR.LANE / NR.PZ - 8 * s / 2 * 2), Math.round(nrY(NR.PZ) - 2), Math.round(8 * s * 2), 3); nrPut(g, body, NR.PZ, nr.x, nr.e); }]);
  items.sort((a, b) => b[0] - a[0]).forEach(([, f]) => f());
  g.restore();
  // les panneaux d'alerte : le prochain obstacle de chaque voie, de plus en plus visible, clignotant quand il est tout près
  if (nr.mode === 'play') for (const lane of [0, 1, 2]) {
    const o = nr.obs.filter(o => o.lane === lane && o.z + o.len > NR.PZ && o.z < 11).sort((a, b) => a.z - b.z)[0];
    if (!o || (o.z < 4 && Math.floor(nr.tick / 5) % 2)) continue;
    const img = NR_HINT[o.type], s = 2, x = Math.round(W / 2 + (lane - 1) * 62 - img.width * s / 2), y = H - img.height * s - 6;
    g.drawImage(img, x, y, img.width * s, img.height * s);
  }
  // score et pièces
  if (nr.mode !== 'ready') { pxFont(g, String(nrScore()), 6, 16, '#ffffff', 12); g.drawImage(NR_SPR.coin[0], W - 46, 7, 14, 14); pxFont(g, String(nr.got), W - 28, 16, '#ffd84a', 12); }
  if (nr.mode === 'over') { g.fillStyle = `rgba(255,40,90,${Math.max(0, .35 - nr.dead / 60)})`; g.fillRect(0, 0, W, H); }
  if (nr.mode === 'ready') gameText(g, W, [['NÉON RUSH', '#ff4fa8', 16], ['Clic ou espace pour courir', '#ffffff'], ['← → voies · ↑ saut · ↓ glisse', '#b8a8e0'], ['Panneaux : jaune saute', '#ffd84a'], ['cyan glisse, rouge change', '#3fe0ff'], ['Record ' + (games.best.neonrush || 0), '#ffd84a']], 120);
  if (nr.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace pour reprendre', '#b8a8e0']], 130);
  if (nr.mode === 'over' && nr.dead > 20) gameText(g, W, [['BOUM !', '#ff4a5a', 14], ['Score ' + nrScore(), '#ffffff'], [nr.why || '', '#ffb0b8'], ['Pièces ' + nr.got + ' · ' + Math.floor(nr.dist * 3) + ' m', '#ffd84a'], [nr.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.neonrush || 0), '#3fe0ff'], [nr.dead > 40 ? 'Espace pour recommencer' : '', '#b8a8e0']], 110);
}
function nrInfo() {
  $('nrStats').replaceChildren(...[['Meilleur score', games.best.neonrush || 0], ['Courses', nrs.runs], ['Pièces au total', nrs.coins], ['Plus de pièces en une course', nrs.bestCoins], ['Distance totale', nrs.meters + ' m']].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
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
{  // vérification : une barrière tue si on ne saute pas, pas si on saute ; un métro au loin laisse toujours une voie libre
  const keep = nr; nr = null; nrNew(); const realBest = games.best.neonrush, realStats = {...nrs};
  nr.mode = 'play'; nr.obs = [{type: 'barrier', lane: 1, z: NR.PZ + .1, len: .35, vz: 0}]; nrUpdate(); const dies = nr.mode === 'over' && nr.why === NR_WHY.barrier;
  nrNew(); nr.mode = 'play'; nr.obs = [{type: 'barrier', lane: 1, z: NR.PZ + .1, len: .35, vz: 0}]; nr.e = 40; nr.ve = 1; nrUpdate(); const jumps = nr.mode === 'play';
  nrNew(); for (let i = 0; i < 200; i++) nrRow(NR.FAR); const blocked = [0, 1, 2].every(l => nr.obs.some(o => o.type === 'train' && o.lane === l && o.z === NR.FAR));
  console.assert(dies && jumps && !blocked, 'neonrush', {dies, jumps, blocked});
  if (realBest === undefined) delete games.best.neonrush; else games.best.neonrush = realBest; Object.assign(nrs, realStats);
  nr = keep;
}
ctx.onOpen(() => {
  if (!nr || !nr.g) { nrNew(); nr.g = $('nrCanvas').getContext('2d'); }
  gameLoop(nr, 'neonrush', nrUpdate, nrDraw); nrInfo();
});
}
