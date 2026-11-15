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
  // chaque quartier, sans pouvoir perdre (on est invincible le temps des images), avec un bonus différent
  const names = [];
  for (const [m, k] of [[30, 'mag'], [440, 'shield'], [840, 'board'], [1240, 'mag']]) {
    await C(`if (nr.mode !== 'play') { T.act('U'); } nr.mode = 'play'; nr.inv = 1e6; T.go(${m}); T.give('${k}'); return 0;`); await sleep(1200);
    names.push(await C('return nr.district;')); await shot('quartier-' + m);
  }
  if (names.join() !== '0,1,2,3') throw new Error('quartiers : ' + names.join());
  await C(`nr.inv = 0; return 0;`);
  // la boutique : un personnage par case, celui choisi marqué
  const shop = await pj(`[document.querySelectorAll('.nrChar').length, document.querySelectorAll('.nrChar.on').length, document.getElementById('nrWallet').textContent]`);
  if (shop[0] !== 5 || shop[1] !== 1 || !/Pièces/.test(shop[2])) throw new Error('boutique : ' + JSON.stringify(shop));
  await pj(`document.getElementById('nrNew').click(), 0`); await sleep(200);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.getElementById('nrFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('nrCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('nrCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('nrCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  return 'quatre quartiers et trois bonus · boutique de ' + shop[0] + ' personnages · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
