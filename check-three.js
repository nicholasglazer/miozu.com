const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const canvas = await page.$('canvas');
  console.log('Canvas exists:', canvas ? 'yes' : 'no');

  const threeContainer = await page.$('.three-canvas');
  console.log('Three container exists:', threeContainer ? 'yes' : 'no');

  await page.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
