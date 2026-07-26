/*
  Este script corre automáticamente en cada despliegue de Netlify (definido en netlify.toml).
  Lee content.json y actualiza el <title> y las etiquetas og:title / og:description
  de index.html, para que la miniatura al compartir el link siempre muestre tu nombre real.
*/
const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'content.json');
const indexPath = path.join(__dirname, '..', 'index.html');

const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
let html = fs.readFileSync(indexPath, 'utf8');

const djName = (data.hero && data.hero.title_line2) || 'NOMBRE';
const title = `DJ ${djName} — Press Kit`;
const description = (data.hero && data.hero.tagline) || 'Press kit oficial.';

html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
html = html.replace(
  /(<meta property="og:title" content=")(.*?)(")/,
  `$1${escapeHtml(title)}$3`
);
html = html.replace(
  /(<meta property="og:description" content=")(.*?)(")/,
  `$1${escapeHtml(description)}$3`
);
html = html.replace(
  /(<meta name="description" content=")(.*?)(")/,
  `$1${escapeHtml(description)}$3`
);

fs.writeFileSync(indexPath, html);
console.log(`Meta tags actualizados → título: "${title}"`);

function escapeHtml(str){
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
