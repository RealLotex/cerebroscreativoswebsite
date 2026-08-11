// Verificación visual real (Playwright/Chromium) del front de propuestas
import { chromium } from 'playwright';

const BASE = 'http://localhost:8333';
const OUT = './screenshots';
const fs = await import('node:fs');

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// desktop + mobile viewports
const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 }, // iPhone-ish
};

const files = [
  { file: 'propuesta.html', label: 'kids', expectDetailBtns: 10 },
  { file: 'propuestajr.html', label: 'jr', expectDetailBtns: 10 },
  { file: 'propuestastudio.html', label: 'studio', expectDetailBtns: 0 }, // sin páginas propias
];

for (const vpName of Object.keys(viewports)) {
  const vp = viewports[vpName];
  for (const f of files) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(`${BASE}/${f.file}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // contar botones '>' reales en el grid (los <a> con '>' dentro del grid de trayectos)
    const detailBtns = await page.$$eval('#trayectos-grid a[aria-label]', (as) => as.filter(a => a.textContent.trim() === '>').length);

    // screenshot de la sección del grid
    const grid = page.locator('#trayectos');
    try {
      await grid.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    } catch (_) {}
    const fileBase = `${OUT}/${vpName}_${f.label}`;
    await page.screenshot({ path: `${fileBase}.png`, fullPage: true });

    // estado del botón Volver (presente y con onclick)
    const hasVolver = await page.$$eval(`button[onclick="goBack()"]`, (bs) => bs.length);

    console.log(`[${vpName}] ${f.label}: detalle '>' en grid=${detailBtns} (esperado ${f.expectDetailBtns}) | Volver=${hasVolver}`);
    if (detailBtns !== f.expectDetailBtns) {
      console.log(`   ⚠️ DISCREPANCIA en ${f.label} (${vpName})`);
    }
    await page.close();
  }
}

await browser.close();
console.log('✅ Screenshots guardados en', OUT);
