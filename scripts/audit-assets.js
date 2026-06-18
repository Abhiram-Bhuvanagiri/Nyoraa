const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'about-us.html',
  'contacts-us.html',
  'coming-soon.html',
  'components/Navbar.html',
  'components/Footer.html',
  'components/Bubbles.html'
];

const assets = new Set();
const assetMap = {};

htmlFiles.forEach(f => {
  if(!fs.existsSync(f)) return;
  const c = fs.readFileSync(f, 'utf8');
  const matches = c.match(/(?:src|href)="([^"]+)"/g);
  if(matches) {
    matches.forEach(m => {
      const url = m.split('="')[1].slice(0, -1);
      if(url.startsWith('/') && !url.endsWith('.html') && !url.includes('#') && !url.startsWith('//') && !url.startsWith('http')) {
        assets.add(url);
        if(!assetMap[url]) assetMap[url] = [];
        assetMap[url].push(f);
      }
    });
  }
});

let missing = 0;
Array.from(assets).forEach(url => {
  // Check if it exists in root or public folder
  const rootPath = path.join(process.cwd(), url);
  const publicPath = path.join(process.cwd(), 'public', url);
  
  if (!fs.existsSync(rootPath) && !fs.existsSync(publicPath)) {
    console.log(`MISSING: ${url} (used in ${assetMap[url].join(', ')})`);
    missing++;
  } else {
    console.log(`FOUND: ${url}`);
  }
});

console.log(`\nTotal assets: ${assets.size}`);
console.log(`Missing assets: ${missing}`);
