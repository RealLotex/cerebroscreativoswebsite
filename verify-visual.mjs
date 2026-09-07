// Verificación visual (Playwright/Chromium) del sistema visual del sitio
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

const pages = [
  { file: 'index.html', label: 'home', theme: 'home-light' },
  { file: 'propuesta.html', label: 'kids', theme: 'proposal-light', detailLinks: 10 },
  { file: 'propuestajr.html', label: 'jr', theme: 'proposal-light', detailLinks: 10 },
  { file: 'propuestastudio.html', label: 'studio', theme: 'proposal-light', detailLinks: 0 },
  { file: 'arte-digital.html', label: 'arte-digital', theme: 'detail-light' },
  { file: 'contenidos-y-marketing.html', label: 'contenidos-marketing', theme: 'detail-light' },
  { file: 'creador-de-contenidos.html', label: 'creador-contenidos', theme: 'detail-light' },
  { file: 'electronica-robotica.html', label: 'electronica-robotica', theme: 'detail-light' },
  { file: 'lectura-critica-y-storytelling.html', label: 'storytelling', theme: 'detail-light' },
  { file: 'modelado-y-animacion-3d.html', label: 'modelado-3d', theme: 'detail-light' },
  { file: 'pequeños-programadores.html', label: 'pequenos-programadores', theme: 'detail-light' },
  { file: 'produccion-musical.html', label: 'produccion-musical', theme: 'detail-light' },
  { file: 'programacion-de-videojuegos-10-11.html', label: 'videojuegos-10-11', theme: 'detail-light' },
  { file: 'programacion-de-videojuegos-12-14.html', label: 'videojuegos-12-14', theme: 'detail-light' },
  { file: 'programacion-de-videojuegos-15.html', label: 'videojuegos-15', theme: 'detail-light' },
  { file: 'programación-en-roblox.html', label: 'roblox', theme: 'detail-light' },
  { file: 'privacy-policy.html', label: 'privacy', theme: 'legal-light' },
  { file: 'terms-of-use.html', label: 'terms', theme: 'legal-light' },
];

let failed = false;

// Global source-level branding contract: every HTML file must use the shared favicon/theme.
const htmlFiles = fs.readdirSync('.').filter(name => name.toLowerCase().endsWith('.html'));
const oldBrandColor = /#(?:00357a|004aad|5ce1e6|78d25e)|(?:0\s*,\s*74\s*,\s*173)|(?:0\s*,\s*53\s*,\s*122)|(?:92\s*,\s*225\s*,\s*230)/i;

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const sourceOk =
    source.includes('cc-favicon.png') &&
    source.includes('brand-theme.css') &&
    source.includes('brand-theme.js') &&
    !oldBrandColor.test(source);

  console.log(`[source] ${file}: favicon/theme=${sourceOk ? 'OK' : 'FAIL'}`);
  if (!sourceOk) failed = true;
}

function logResult(ok, vpName, p, details) {
  console.log(`[${vpName}] ${p.label}: ${details} | ${ok ? 'OK' : 'FAIL'}`);
  if (!ok) failed = true;
}

for (const [vpName, vp] of Object.entries(viewports)) {
  for (const p of pages) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto(`${BASE}/${encodeURI(p.file)}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    const hasTheme = await page.evaluate((theme) => document.body.classList.contains(theme), p.theme);
    const horizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );

    const globalBrandOk = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const primary = styles.getPropertyValue('--cc-primary').trim().toLowerCase();
      const accent = styles.getPropertyValue('--cc-accent').trim().toLowerCase();
      const favicon = document.querySelector('link[rel="icon"]')?.getAttribute('href') || '';
      const chrome = document.querySelector('nav, header');
      const hasBrandName = /Cerebros\s*Creativos|CerebrosCreativos/i.test(chrome?.textContent || '');
      const hasMark = !!chrome?.querySelector('.cc-navbar-mark');

      return primary === '#0f766e' &&
        accent === '#82fccc' &&
        favicon.includes('cc-favicon.png') &&
        (!hasBrandName || hasMark);
    });
    const bodyIsLight = await page.evaluate(() => {
      const rgb = getComputedStyle(document.body).backgroundColor.match(/\d+/g)?.map(Number) || [];
      return rgb.length >= 3 && rgb[0] > 220 && rgb[1] > 220 && rgb[2] > 220;
    });

    let extraOk = true;
    const extra = [];

    if (p.theme === 'proposal-light') {
      const detailLinks = await page.locator('#trayectos-grid .course-detail-link').count();
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
      const touchFailures = vpName === 'mobile'
        ? await page.evaluate(() =>
            [...document.querySelectorAll('#trayectos-grid .course-detail-link')]
              .filter(el => el.getBoundingClientRect().height < 44).length
          )
        : 0;
      const haloCount = await page.locator('.final-cta [class*="from-blue-500"]').count();

      const lightCertificationSurfaces = await page.evaluate(() => {
        const stages = [...document.querySelectorAll('#modalidad .certification-stage')];
        if (!stages.length) return false;
        return stages.every(stage => {
          const rgb = getComputedStyle(stage).backgroundColor.match(/\d+/g)?.map(Number) || [];
          return rgb.length >= 3 && rgb[0] > 190 && rgb[1] > 190 && rgb[2] > 190;
        });
      });

      const autoLearningLight = p.label === 'jr' || p.label === 'studio'
        ? await page.evaluate(() => {
            const card = document.querySelector('#modalidad .modality-auto-card');
            if (!card) return false;
            const rgb = getComputedStyle(card).backgroundColor.match(/\d+/g)?.map(Number) || [];
            const h3 = card.querySelector('h3');
            const color = h3 ? getComputedStyle(h3).color.match(/\d+/g)?.map(Number) || [] : [];
            const light = rgb.length >= 3 && rgb[0] > 230 && rgb[1] > 230 && rgb[2] > 230;
            const darkText = color.length >= 3 && Math.max(...color.slice(0, 3)) < 100;
            return light && darkText;
          })
        : true;

      extraOk = detailLinks === p.detailLinks && overlaps === 0 && touchFailures === 0 && haloCount === 0 && lightCertificationSurfaces && autoLearningLight;
      extra.push(`links=${detailLinks}/${p.detailLinks}`, `overlaps=${overlaps}`, `touch<44=${touchFailures}`, `ctaHalo=${haloCount}`, `certLight=${lightCertificationSurfaces}`, `autoLight=${autoLearningLight}`);

      if (p.label === 'kids') {
        const firstCardText = await page.locator('#trayectos-grid .course-card').first().innerText();
        const oldAgePresent = /10\s*a\s*11|10\s*[-–]\s*11/.test(firstCardText);
        const certColorsOk = await page.evaluate(() => {
          const stages = [...document.querySelectorAll('#modalidad .space-y-8 > .flex > .flex-1')];
          if (stages.length < 3) return false;
          return stages.every(stage => {
            const bg = getComputedStyle(stage).backgroundColor.match(/\d+/g)?.map(Number) || [];
            const label = stage.querySelector('p:last-child');
            const color = label ? getComputedStyle(label).color.match(/\d+/g)?.map(Number) || [] : [];
            const lightBg = bg.length >= 3 && bg[0] > 190 && bg[1] > 190 && bg[2] > 190;
            const readableLabel = color.length >= 3 && Math.min(...color.slice(0,3)) < 150;
            return lightBg && readableLabel;
          });
        });
        extraOk = extraOk && !oldAgePresent && certColorsOk;
        extra.push(`oldAge=${oldAgePresent}`, `certColors=${certColorsOk}`);
      }
    }

    if (p.theme === 'detail-light') {
      const haloCount = await page.locator('.final-cta [class*="from-blue-500"]').count();
      const rawBlueHalos = await page.locator('[class*="from-blue-500"][class*="radial-gradient"]').count();
      const finalCta = await page.locator('.final-cta').count();
      extraOk = haloCount === 0 && rawBlueHalos === 0;
      extra.push(`finalCTA=${finalCta}`, `ctaHalo=${haloCount}`, `rawBlueHalo=${rawBlueHalos}`);
    }

    if (p.theme === 'home-light') {
      const cards = await page.locator('.home-proposal-card').count();
      const realTextBrands = await page.locator('.home-proposal-card__brand').count();
      const croppedLogos = await page.locator('.home-proposal-card__logo-crop').count();
      const oldLogoBanners = await page.locator('main img[alt^="Cerebros Creativos"]').count();
      const visualStyleOk = await page.evaluate(() => {
        const card = document.querySelector('.home-proposal-card');
        const pill = document.querySelector('.home-proposal-card__pill');
        const studio = document.querySelector('.home-proposal-card__logo-crop--studio img');
        const jrCrop = document.querySelector('.home-proposal-card__logo-crop--jr');
        if (!card || !pill || !studio || !jrCrop) return false;

        const cardBg = getComputedStyle(card).backgroundColor.match(/\d+/g)?.map(Number) || [];
        const pillBg = getComputedStyle(pill).backgroundColor.match(/\d+/g)?.map(Number) || [];
        const studioFilter = getComputedStyle(studio).filter;
        const jrOverflow = getComputedStyle(jrCrop).overflow;

        const cardIsLight = cardBg.length >= 3 && cardBg[0] > 240 && cardBg[1] > 240 && cardBg[2] > 240;
        const pillIsLightBlue = pillBg.length >= 3 && pillBg[2] >= pillBg[0] && pillBg[1] >= pillBg[0];
        const studioIsBlackFiltered = studioFilter !== 'none' && studioFilter.includes('brightness(0');
        const jrIsCropped = jrOverflow === 'hidden';

        return cardIsLight && pillIsLightBlue && studioIsBlackFiltered && jrIsCropped;
      });

      extraOk = cards === 3 && realTextBrands === 3 && croppedLogos === 3 && oldLogoBanners === 0 && visualStyleOk;
      extra.push(
        `proposalCards=${cards}`,
        `realTextBrands=${realTextBrands}`,
        `croppedLogos=${croppedLogos}`,
        `oldLogoBanners=${oldLogoBanners}`,
        `homeStyle=${visualStyleOk}`
      );
    }

    if (p.theme === 'legal-light') {
      const mainCount = await page.locator('main').count();
      const tealHeadings = await page.evaluate(() => {
        const h2 = document.querySelector('.legal-content h2');
        if (!h2) return false;
        const border = getComputedStyle(h2).borderLeftColor.match(/\d+/g)?.map(Number) || [];
        return border.length >= 3 && border[1] > border[0] && border[1] > border[2];
      });
      extraOk = mainCount === 1 && tealHeadings;
      extra.push(`main=${mainCount}`, `tealHeadings=${tealHeadings}`);
    }

    const ok = hasTheme && bodyIsLight && !horizontalOverflow && globalBrandOk && extraOk;
    logResult(ok, vpName, p, [
      `theme=${hasTheme}`,
      `light=${bodyIsLight}`,
      `overflow=${horizontalOverflow}`,
      `brand=${globalBrandOk}`,
      ...extra
    ].join(' | '));

    await page.screenshot({ path: `${OUT}/${vpName}_${p.label}.png`, fullPage: true });
    await page.close();
  }
}

await browser.close();

if (failed) {
  console.error('Visual verification failed');
  process.exit(1);
}

console.log('Visual verification OK. Screenshots guardados en', OUT);
