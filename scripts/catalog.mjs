import { readFile, writeFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/catalog.json', root), 'utf8'));
assert.equal(catalog.schemaVersion, 1);
assert.deepEqual(Object.keys(catalog).sort(), ['schemaVersion', 'tracks']);
assert(Array.isArray(catalog.tracks) && catalog.tracks.length > 0 && catalog.tracks.length <= 500);
const seen = new Set();
const age = v => v === null || (Number.isInteger(v) && v >= 0 && v <= 120);
for (const t of catalog.tracks) {
  assert.deepEqual(Object.keys(t).sort(), ['active','ageMax','ageMin','family','name','slug','url']);
  assert(typeof t.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.slug) && !seen.has(t.slug), `Slug inválido: ${t.slug}`);
  seen.add(t.slug);
  assert(typeof t.family === 'string' && /^[a-z0-9-]+$/.test(t.family));
  assert(typeof t.name === 'string' && t.name.trim() && t.name.length <= 160 && !/(?:ARS|\$|13[.,]?500)/i.test(t.name));
  assert(typeof t.active === 'boolean' && age(t.ageMin) && age(t.ageMax));
  assert(t.ageMin === null || t.ageMax === null || t.ageMin <= t.ageMax);
  assert(typeof t.url === 'string' && /^\/[\p{L}\p{N}_/-]+\.html$/u.test(t.url) && !t.url.includes('//'));
  if (t.active) await access(new URL(t.url.slice(1), root));
}
assert(catalog.tracks.some(t => t.active));
// Compatibility export, generated exclusively from the canonical catalog.
const legacy = catalog.tracks.filter(t => t.active).map(t => ({
  trayecto:t.family, slug:t.slug, nombre:t.name, edad_min:t.ageMin, edad_max:t.ageMax, url:t.url,
}));
const file = new URL('data/trayectos.json', root);
if (process.argv.includes('--write')) await writeFile(file, JSON.stringify(legacy, null, 2) + '\n');
else assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), legacy, 'Ejecutar npm run catalog:generate');
console.log(`Catálogo: ${catalog.tracks.length} entradas válidas; páginas activas presentes.`);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cards = catalog.tracks.filter(t => t.active).map(t => {
  const ages = t.ageMin === null && t.ageMax === null ? 'Consultar edades' :
    t.ageMax === null ? `Desde ${t.ageMin} años` : t.ageMin === null ? `Hasta ${t.ageMax} años` : `${t.ageMin}–${t.ageMax} años`;
  const whatsapp = 'https://wa.me/5493404564631?text=' + encodeURIComponent(`Hola, estuve viendo ${t.name}. Quería consultar por esta propuesta.`);
  return `<article><h2>${escape(t.name)}</h2><p>${escape(ages)}</p><a href="${escape(t.url)}">Ver propuesta</a><a href="${escape(whatsapp)}">Consultar por WhatsApp</a></article>`;
}).join('\n');
const html = `<!doctype html>
<!-- Generado por scripts/catalog.mjs desde data/catalog.json. No editar. -->
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Propuestas | Cerebros Creativos</title><meta name="description" content="Conocé las propuestas de Cerebros Creativos y consultá por WhatsApp.">
<link rel="canonical" href="https://cerebroscreativos.org/catalogo.html">
<style>body{font:1rem/1.6 system-ui,sans-serif;margin:auto;padding:1.5rem;max-width:72rem;color:#123d3a;background:#f4faf8}nav{margin-bottom:2rem}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1rem}article{padding:1.5rem;background:white;border:1px solid #acc9c2;border-radius:1rem}h2{font-size:1.2rem}a{color:#075d51;text-underline-offset:.2em}article a{display:block;padding:.6rem 0}a:focus-visible{outline:3px solid #075d51;outline-offset:4px}</style>
</head><body><nav aria-label="Principal"><a href="/index.html">Volver al inicio</a></nav><main><h1>Nuestras propuestas</h1><p>Descubrí los trayectos y consultanos para elegir la propuesta adecuada.</p><section aria-label="Catálogo">${cards}</section></main></body></html>\n`;
const page = new URL('catalogo.html', root);
if (process.argv.includes('--write')) await writeFile(page, html);
else assert.equal(await readFile(page, 'utf8'), html, 'Catálogo HTML desactualizado: npm run catalog:generate');
