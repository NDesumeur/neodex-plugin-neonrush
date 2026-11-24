// lancé par le test « local » de NeoDex : la vérification interne, une course dans les quatre quartiers avec les bonus, la boutique
// des personnages, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const cv = document.getElementById('nrCanvas'), T = cv.__nr, nr = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('nrCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'neonrush-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('nrNew').click(), 0`); await sleep(200);
  await C(`T.act('U'); return 0;`); await sleep(1500); await shot('0-course');
  if (await C('return nr.mode;') !== 'play' && await C('return nr.mode;') !== 'over') throw new Error('la course ne démarre pas');
  // une vraie course de quelques secondes (invincible le temps des images), puis le jetpack, l'aimant, une lettre du jour, une mission
  await C(`if (nr.mode !== 'play') T.act('U'); nr.mode = 'play'; nr.inv = 1e6; T.go(120); return 0;`); await sleep(2500); await shot('1-route');
  const rows = await C('return nr.obs.length + " " + nr.coins.length;'); if (+rows.split(' ')[0] < 1) throw new Error('aucun obstacle : ' + rows);
  await C(`nr.lane = 1; nr.x = 0; nr.inv = 0; nr.noRows = true; nr.obs = [{type: 'gate', lane: 0, z: 45, len: 2, vz: 0}, {type: 'beam', lane: 2, z: 60, len: 2, vz: 0}, {type: 'block', lane: 1, z: 170, len: 50, vz: .35}, {type: 'block', lane: 0, z: 90, len: 60, vz: 0}];
    nr.coins = [0, 1, 2, 3, 4, 5].map(i => ({lane: 1, z: 40 + i * 6, h: 0})); nr.items = [{type: 'x2', lane: 2, z: 100}]; nr.letters = [{lane: 1, z: 110, ch: 'N'}]; return 0;`); await sleep(250); await shot('1b-vitrine');
  await C(`nr.obs = []; nr.noRows = false; nr.inv = 1e6; return 0;`);
  await C(`T.give('jet'); return 0;`); await sleep(1500); await C('nr.inv = 0; return 0;'); await sleep(100); await shot('2-jetpack'); await C('nr.inv = 1e6; return 0;');
  const fly = await C('return Math.round(nr.e);'); if (fly < 30) throw new Error('le jetpack ne vole pas : ' + fly);
  await C(`nr.jet = 0; T.give('mag'); nr.letters.push({lane: nr.lane, z: 60, ch: 'N'}); return 0;`); await sleep(500); await shot('3-lettre');
  await C(`nr.msg = {text: 'MISSION RÉUSSIE', sub: 'Sauter des lasers', t: 200}; return 0;`); await sleep(200); await shot('4-mission');
  await C(`nr.inv = 0; nr.boardOn = false; nr.shield = 0; nr.obs = [{type: 'block', lane: nr.lane, z: 21, len: 40, vz: 0}]; return 0;`); await sleep(1600); await shot('5-boum');
  if (await C('return nr.mode;') !== 'over') throw new Error('le camion devait arrêter la course');
  const mis = await pj(`[document.querySelectorAll('#nrMis .nrMisRow').length, document.querySelectorAll('#nrWord span').length, document.getElementById('nrLvl').textContent]`);
  if (mis[0] !== 3 || mis[1] < 4 || !/×/.test(mis[2])) throw new Error('missions et chasse : ' + JSON.stringify(mis));
  // la boutique : cinq personnages et quatre planches, un choisi dans chaque
  const shop = await pj(`[document.querySelectorAll('#nrChars .nrChar').length, document.querySelectorAll('#nrBoards .nrChar').length, document.querySelectorAll('.nrChar.on').length, document.getElementById('nrWallet').textContent]`);
  if (shop[0] !== 5 || shop[1] !== 4 || shop[2] !== 2 || !/Pièces/.test(shop[3])) throw new Error('boutique : ' + JSON.stringify(shop));
  await pj(`document.getElementById('nrNew').click(), 0`); await sleep(200);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.getElementById('nrFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('nrCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('nrCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('nrCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  return 'route, jetpack, lettre du jour, missions (' + mis[0] + ') · boutique de ' + shop[0] + ' personnages et ' + shop[1] + ' planches · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
