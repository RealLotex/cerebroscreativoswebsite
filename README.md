# Cerebros Creativos — web comercial

HTML + Tailwind + JSON, sin servidor de aplicación. El core y sus datos privados
viven en otro repositorio. Node se usa únicamente para preparar y verificar assets.

## Desarrollo

Node 24.20.0, luego `npm ci` y `npm run build`.
No versionar node_modules. `dist/output.css` se conserva como asset estático para
compatibilidad con el alojamiento actual. No servir la raíz del repositorio sin
excluir scripts, tests, dependencias y configuración del despliegue.

## Catálogo

Editar **data/catalog.json**, ejecutar `npm run catalog:generate` y revisar el diff.
El generador produce `catalogo.html` y `data/trayectos.json` (compatibilidad; no editar).
`npm test` rechaza campos extra, slugs duplicados, edades inválidas, URLs inseguras,
páginas activas ausentes y archivos generados desactualizados. No publicar precios
ni información personal. Las edades null son datos aún no especificados.
Se mantienen URLs y categorías históricas para no romper enlaces del core.
Las cards del catálogo generado incluyen contexto en el enlace de WhatsApp.

El core incorpora una copia validada del JSON por release. Una conversación no
depende de descargar el sitio. La URL prevista es
https://cerebroscreativos.org/data/catalog.json; requiere publicar esta rama.

## CI y alojamiento

`npm run build` produce únicamente archivos públicos en `site/`. Publicar ese
directorio, nunca la raíz del repositorio. Las 25 propuestas conservan sus URLs;
el catálogo genera las tarjetas y sus enlaces de consulta con contexto.

Actions valida catálogo, HTML, enlaces locales, ausencia de precios y Meta Pixel,
y ejecuta Playwright con navegación, SEO, tres anchos de pantalla y axe WCAG AA.
Para repetir: `npm run build`, `node scripts/validate-site.mjs`,
`npx playwright install chromium` y `npx playwright test`.

Cloudflare Pages: proyecto `cerebroscreativoswebsite`, salida `site/`, sin Functions.
El despliegue debe ejecutarse después de estas verificaciones. Requiere una sesión
Wrangler o los secretos `CLOUDFLARE_API_TOKEN` (permiso Pages Edit de esta cuenta)
y `CLOUDFLARE_ACCOUNT_ID`. El dominio se cambia solamente tras verificar la versión
publicada; conservar los registros de correo.

El build elimina Meta Pixel y los scripts de consentimiento que dependían de él.
Cloudflare Web Analytics ya tiene instalación automática configurada en la zona;
no agregar un segundo beacon. El acceso a clases conserva sus enlaces existentes.
El portal familiar sigue fuera de esta web comercial inicial.
