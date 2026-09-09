import { readdir, readFile, access } from 'node:fs/promises';
import { load } from 'cheerio';
import { HtmlValidate } from 'html-validate';
import assert from 'node:assert/strict';
const files=(await readdir('site')).filter(f=>f.endsWith('.html'));
const catalog=JSON.parse(await readFile('site/data/catalog.json','utf8'));
const validator=new HtmlValidate({extends:['html-validate:recommended'],rules:{'no-inline-style':'off','long-title':'off','prefer-native-element':'off','class-pattern':'off','heading-level':'off','void-style':'off','no-trailing-whitespace':'off','attr-quotes':'off','doctype-style':'off'}});
let errors=[];
for(const file of files){
 const html=await readFile(`site/${file}`,'utf8'),$=load(html);
 const result=await validator.validateString(html,file);
 for(const r of result.results) for(const m of r.messages) errors.push(`${file}:${m.line} ${m.ruleId} ${m.message}`);
 if(/fbq\(|connect.facebook.net|facebook.com\/tr\?|13[.,]?500|ARS\s*\d|\$\s*\d/.test(html)) errors.push(`${file}: publicidad o precio público`);
 for(const el of $('[href],[src]').toArray()){
  const href=$(el).attr('href')??$(el).attr('src'); if(!href||/^(mailto:|tel:|data:)/.test(href))continue;
  const u=new URL(href,`https://cerebroscreativos.org/${file}`);
  if(u.hostname!=='cerebroscreativos.org')continue;
  let target=decodeURIComponent(u.pathname).slice(1)||'index.html';
  if(!/\.[a-z0-9]+$/i.test(target)) target+='.html';
  try{await access(`site/${target}`);}catch{errors.push(`${file}: enlace ausente ${href}`);continue;}
  if(u.hash&&target.endsWith('.html')){
   const dest=load(await readFile(`site/${target}`,'utf8'));
   if(!dest('[id]').toArray().some(e=>dest(e).attr('id')===decodeURIComponent(u.hash.slice(1))))errors.push(`${file}: ancla ausente ${href}`);
  }
 }
 if(file!=='404.html')assert.equal($('nav[aria-label="Principal"]').length,1,file);
}
const $=load(await readFile('site/catalogo.html','utf8'));
for(const t of catalog.tracks.filter(t=>t.active)){
 assert($('article').toArray().some(e=>$(e).find('a').toArray().some(a=>$(a).attr('href')===t.url)),t.slug);
 const page=load(await readFile(`site${t.url}`,'utf8'));
 assert(page('a[href^="https://wa.me/"]').toArray().some(e=>new URL(page(e).attr('href')).searchParams.get('text').includes(t.name)),t.slug);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`HTML, enlaces, catálogo y CTA verificados: ${files.length} páginas`);
