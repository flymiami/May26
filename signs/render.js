const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 480, height: 672 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/signs.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: __dirname + '/lobby_signs_5x7.pdf', width: '5in', height: '7in', printBackground: true });
  const secs = await p.$$('section');
  await secs[0].screenshot({ path: __dirname + '/atelier_sign.png' });
  await secs[1].screenshot({ path: __dirname + '/art_sign.png' });
  await b.close();
})();
