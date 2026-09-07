// Verificación visual (Playwright/Chromium) de las propuestas
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8333';
const OUT = './screenshots';
const fs = await import('node:fs');

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

const files = [
  { file: 'propuesta.html', label: 'kids', expectDetailLinks: 10 },
  { file: 'propuestajr.html', label: 'jr', expectDetailLinks: 10 },
  { file: 'propuestastudio.html', label: 'studio', expectDetailLinks: 0 },
];

let failed = false;

for (const [vpName, vp] of Object.entries(viewports)) {
  for (const f of files) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(`${BASE}/${f.file}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);

    const detailLinks = await page.locator('#trayectos-grid .course-detail-link').count();
    const hasVolver = await page.locator('button[onclick="goBack()"]').count();
    const isLight = await page.evaluate(() => document.body.classList.contains('proposal-light'));

    const horizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );

    const overlaps = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('#trayectos-grid .course-card')];
      return cards.filter(card => {
        const icon = card.querySelector('.course-icon');
        const link = card.querySelector('.course-detail-link');
        if (!icon || !link) return false;
        const a = icon.getBoundingClientRect();
        const b = link.getBoundingClientRect();
        return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
      }).length;
    });

    const touchTargetFailures = vpName === 'mobile'
      ? await page.evaluate(() =>
          [...document.querySelectorAll('#trayectos-grid .course-detail-link')]
            .filter(el => el.getBoundingClientRect().height < 44).length
        )
      : 0;

    await page.locator('#trayectos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/${vpName}_${f.label}.png`, fullPage: true });

    const ok =
      detailLinks === f.expectDetailLinks &&
      hasVolver === 1 &&
      isLight &&
      !horizontalOverflow &&
      overlaps === 0 &&
      touchTargetFailures === 0;

    console.log(
      `[${vpName}] ${f.label}: links=${detailLinks}/${f.expectDetailLinks} | volver=${hasVolver} | light=${isLight} | overflow=${horizontalOverflow} | overlaps=${overlaps} | touch<44=${touchTargetFailures} | ${ok ? 'OK' : 'FAIL'}`
    );

    if (!ok) failed = true;
    await page.close();
  }
}

await browser.close();

if (failed) {
  console.error('Visual verification failed');
  process.exit(1);
}

console.log('Visual verification OK. Screenshots guardados en', OUT);
