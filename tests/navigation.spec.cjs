const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs=require('node:fs');
const files=fs.readdirSync('site').filter(f=>f.endsWith('.html')&&f!=='404.html');
for(const file of files){
 test(`${file}: navegación, SEO y accesibilidad`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/'+file);
  await expect(page.getByRole('navigation',{name:'Principal'})).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  for(const width of [320,390,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${file} ${width}px overflow`).toBe(true);
  }
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
  expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(errors).toEqual([]);
 });
}
test('Catálogo completo y contexto WhatsApp',async({page})=>{
 const catalog=JSON.parse(fs.readFileSync('data/catalog.json','utf8'));
 await page.goto('/catalogo.html');
 for(const t of catalog.tracks.filter(t=>t.active)){
  const card=page.locator('article').filter({has:page.getByRole('heading',{name:t.name,exact:true})});
  await expect(card.getByRole('link',{name:'Ver propuesta'})).toHaveAttribute('href',t.url);
  const href=await card.getByRole('link',{name:'Consultar por WhatsApp'}).getAttribute('href');
  expect(new URL(href).searchParams.get('text')).toContain(t.name);
 }
 await page.getByRole('navigation').getByRole('link',{name:'Cerebros Creativos',exact:true}).click();
 await expect(page).toHaveURL(/index.html$/);
});
