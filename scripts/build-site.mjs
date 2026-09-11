import { readFile, writeFile, readdir, mkdir, cp, rm } from 'node:fs/promises';
import { load } from 'cheerio';
import vm from 'node:vm';
const catalog = JSON.parse(await readFile('data/catalog.json', 'utf8'));
const tracks = catalog.tracks.filter(t => t.active);
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wa = name => 'https://wa.me/5493404564631?text=' + encodeURIComponent(`Hola, estuve viendo ${name}. Quería consultar por esta propuesta.`);
await rm('site', {recursive:true,force:true}); await mkdir('site/dist', {recursive:true});
for (const dir of ['images','guiajitsi','clase']) await cp(dir, `site/${dir}`, {recursive:true});
for (const f of await readdir('.')) if (/\.(png|ico|css)$/.test(f)) await cp(f, `site/${f}`);
for (const f of ['dist/output.css','data/catalog.json','data/trayectos.json']) {
  await mkdir(`site/${f.split('/')[0]}`, {recursive:true}); await cp(f, `site/${f}`);
}
const files = (await readdir('.')).filter(f=>f.endsWith('.html') && !/( - copia| copy)\.html$/.test(f));
for (const file of files) {
  const source = (await readFile(file,'utf8')).replaceAll('\\n','\n');
  const $ = load(source);
  const track = tracks.find(t=>t.url === '/' + file);
  const name = track?.name ?? (file === 'index.html' ? 'Cerebros Creativos' : $('title').text());
  // Source arrays retain editorial grouping only. Published names and targets are canonical.
  const array = source.match(/const trayectosData = (\[[\s\S]*?\n\s*\]);/);
  if (array) {
    const items = vm.runInNewContext('(' + array[1] + ')', {}, {timeout:1000});
    const members = items.map(item => tracks.find(t=>t.url === '/' + item.url));
    if (members.some(t=>!t)) throw new Error(`${file}: oferta fuera del catálogo`);
    $('#trayectos-grid').html(members.map(t=>`<article class="course-card"><h3>${escape(t.name)}</h3><p>Conocé el trayecto y consultá por las modalidades disponibles.</p><a class="course-detail-link" href="${escape(t.url)}">Ver propuesta</a><a class="course-detail-link" href="${escape(wa(t.name))}">Consultar por WhatsApp</a></article>`).join(''));
    $('.proposal-carousel').html(`<h2>Encontrá tu próximo proyecto</h2><p>Explorá las propuestas y elegí con nuestro asesoramiento.</p><a href="#trayectos">Ver todos los trayectos</a>`);
  }
  // Commercial pages have no advertising scripts or runtime CSS/compiler dependencies.
  $('script,noscript,cookies-consent,custom-footer,footer').remove();
  $('[class]').each((_,el)=>$(el).attr('class',[...new Set(($(el).attr('class')??'').split(/\s+/))].join(' ')));
  $('a[href^="tel:"]').each((_,el)=>{ $(el).text($(el).text().trim().replace(/\s+/g,'\u00a0')); });
  $('*').each((_,el)=>{ for(const a of Object.keys(el.attribs??{})) if(a.startsWith('on')) $(el).removeAttr(a); });
  $('link[href*="fonts.googleapis"],link[href*="fonts.gstatic"]').remove();
  $('nav').remove();
  $('body').prepend(`<a class="cc-skip" href="#contenido">Saltar al contenido</a><nav class="cc-nav" aria-label="Principal"><a href="/index.html">Cerebros Creativos</a><a href="/catalogo.html">Propuestas</a><a href="/acceso.html">Clases</a><a href="${escape(wa(name))}">Consultar por WhatsApp</a></nav>`);
  if (!$('main').length) {
    const bodyContent = $('body').children().not('nav,.cc-skip');
    bodyContent.wrapAll('<main id="contenido"></main>');
  } else $('main').first().attr('id','contenido');
  if (file !== 'index.html') $('main').first().prepend('<p><a href="/catalogo.html">← Volver a las propuestas</a></p>');
  if (file !== 'acceso.html') $('acceso-a-clases').remove();
  else $('body').append('<script src="/acceso-a-clases.js" defer></script>');
  $('a').each((_,el)=>{
    const a=$(el), href=a.attr('href')??'';
    const linked=tracks.find(t=>t.url===href);
    if(linked && a.hasClass('home-proposal-card__cta')) a.text('Ver '+linked.name);
    if (/inscripciones/.test(href)) { a.attr('href', wa(name)); if(!a.text().trim()) a.text('Consultar por WhatsApp'); }
    if (a.attr('target')==='_blank') a.attr('rel','noopener noreferrer');
  });
  // Every detail page has a direct, contextual conversion path.
  if(track) $('main').append(`<section class="cc-consulta" aria-label="Consulta"><h2>¿Querés saber más?</h2><a href="${escape(wa(name))}">Consultar por WhatsApp</a></section>`);
  $('body').append('<footer class="cc-footer"><a href="/index.html">Inicio</a> · <a href="/catalogo.html">Propuestas</a> · <a href="/privacy-policy.html">Privacidad</a> · <a href="/terms-of-use.html">Términos de uso</a><p>© 2026 Cerebros Creativos</p></footer>');
  $('html').attr('lang','es');
  $('title').text(`${name} | Cerebros Creativos`.replace('Cerebros Creativos | Cerebros Creativos','Cerebros Creativos'));
  $('meta[http-equiv="refresh"],meta[name="description"],link[rel="canonical"]').remove();
  $('head').append(`<meta name="description" content="${escape(`Conocé ${name}. Formación online y consultas por WhatsApp.`)}"><link rel="canonical" href="https://cerebroscreativos.org/${file==='index.html'?'':encodeURI(file)}">`);
  if(!$('link[href*="output.css"]').length) $('head').append('<link rel="stylesheet" href="/dist/output.css">');
  $('head').append('<link rel="stylesheet" href="/site.css">');
  $('img').each((_,el)=>{const img=$(el); if(!img.attr('alt') || img.attr('alt')==='Background') img.attr('alt',''); img.attr('loading','lazy'); });
  $('button').attr('type','button');
  if(file==='inscripciones.html') $('main').html(`<h1>Consultá tu inscripción</h1><p>Te ayudamos a elegir una propuesta.</p><a href="${escape(wa('Cerebros Creativos'))}">Consultar por WhatsApp</a>`);
  await writeFile(`site/${file}`, $.html().replaceAll('defer=""','defer'));
}
await cp('src/site.css','site/site.css');
await cp('acceso-a-clases.js','site/acceso-a-clases.js');
await writeFile('site/404.html','<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página no encontrada</title></head><body><main><h1>Página no encontrada</h1><a href="/catalogo.html">Ver propuestas</a></main></body></html>');
await writeFile('site/robots.txt','User-agent: *\nAllow: /\nSitemap: https://cerebroscreativos.org/sitemap.xml\n');
await writeFile('site/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+files.filter(f=>!['inscripciones.html','primeraclase.html','ingresardesdecelular.html'].includes(f)).map(f=>`<url><loc>https://cerebroscreativos.org/${f==='index.html'?'':encodeURI(f)}</loc></url>`).join('')+'</urlset>');
console.log(`Build estático: ${files.length} páginas en site/`);
