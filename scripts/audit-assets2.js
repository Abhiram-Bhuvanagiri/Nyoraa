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

// Find src="..." and url(...)
htmlFiles.forEach(f => {
  if(!fs.existsSync(f)) return;
  const c = fs.readFileSync(f, 'utf8');
  
  // match src=""
  const srcMatches = c.match(/src="([^"]+)"/g);
  if(srcMatches) {
    srcMatches.forEach(m => {
      const url = m.split('="')[1].slice(0, -1);
      if(url.startsWith('/') && !url.startsWith('//') && !url.startsWith('http')) {
        assets.add(url);
        if(!assetMap[url]) assetMap[url] = [];
        assetMap[url].push(`src in ${f}`);
      }
    });
  }

  // match url('') or url("")
  const urlMatches = c.match(/url\(['"]?([^'"\)]+)['"]?\)/g);
  if(urlMatches) {
    urlMatches.forEach(m => {
      const url = m.replace(/url\(['"]?([^'"\)]+)['"]?\)/, '$1');
      if(url.startsWith('/') && !url.startsWith('//') && !url.startsWith('http')) {
        assets.add(url);
        if(!assetMap[url]) assetMap[url] = [];
        assetMap[url].push(`url() in ${f}`);
      }
    });
  }
});

// Also check globals.css
if (fs.existsSync('globals.css')) {
  const c = fs.readFileSync('globals.css', 'utf8');
  const urlMatches = c.match(/url\(['"]?([^'"\)]+)['"]?\)/g);
  if(urlMatches) {
    urlMatches.forEach(m => {
      const url = m.replace(/url\(['"]?([^'"\)]+)['"]?\)/, '$1');
      if(url.startsWith('/') && !url.startsWith('//') && !url.startsWith('http')) {
        assets.add(url);
        if(!assetMap[url]) assetMap[url] = [];
        assetMap[url].push(`url() in globals.css`);
      }
    });
  }
}

let missing = 0;
Array.from(assets).forEach(url => {
  const rootPath = path.join(process.cwd(), url);
  const publicPath = path.join(process.cwd(), 'public', url);
  
  if (!fs.existsSync(rootPath) && !fs.existsSync(publicPath)) {
    console.log(`MISSING: ${url} (used in ${assetMap[url].join(', ')})`);
    missing++;
  } else {
    // console.log(`FOUND: ${url}`);
  }
});

console.log(`\nTotal assets extracted: ${assets.size}`);
console.log(`Missing assets: ${missing}`);
