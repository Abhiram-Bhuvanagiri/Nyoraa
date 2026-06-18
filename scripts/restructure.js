const fs = require('fs');
const path = require('path');

// 1. Move files
const moves = [
  { from: 'app/page.html', to: 'index.html' },
  { from: 'app/about-us/page.html', to: 'about-us.html' },
  { from: 'app/contacts-us/page.html', to: 'contacts-us.html' },
  { from: 'app/coming-soon/page.html', to: 'coming-soon.html' },
  { from: 'app/globals.css', to: 'globals.css' }
];

moves.forEach(m => {
  if (fs.existsSync(m.from)) {
    fs.renameSync(m.from, m.to);
    console.log(`Moved ${m.from} to ${m.to}`);
  }
});

// Move components directory
if (fs.existsSync('app/components') && !fs.existsSync('components')) {
  fs.renameSync('app/components', 'components');
  console.log('Moved app/components to components');
}

// 2. Update references in HTML files
const htmlFiles = [
  'index.html',
  'about-us.html',
  'contacts-us.html',
  'coming-soon.html',
  'components/Navbar.html',
  'components/Footer.html',
  'components/Bubbles.html'
];

htmlFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  
  // Update CSS path
  c = c.replace(/href="\/app\/globals\.css"/g, 'href="/globals.css"');
  
  // Update component fetch paths
  c = c.replace(/'\/app\/components\//g, "'/components/");
  
  // Update internal navigation links
  c = c.replace(/href="\/page\.html"/g, 'href="/"');
  c = c.replace(/href="\/about-us\/page\.html"/g, 'href="/about-us"');
  c = c.replace(/href="\/contacts-us\/page\.html"/g, 'href="/contacts-us"');
  c = c.replace(/href="\/coming-soon\/page\.html"/g, 'href="/coming-soon"');
  
  fs.writeFileSync(f, c);
  console.log(`Updated paths in ${f}`);
});

// 3. Update vercel.json
const vercelConfig = {
  "cleanUrls": true,
  "rewrites": [
    { "source": "/", "destination": "/index.html" },
    { "source": "/about-us", "destination": "/about-us.html" },
    { "source": "/contacts-us", "destination": "/contacts-us.html" },
    { "source": "/coming-soon", "destination": "/coming-soon.html" }
  ]
};
fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('Updated vercel.json');

// 4. Update server.js for local testing
let serverCode = fs.readFileSync('server.js', 'utf8');
serverCode = serverCode.replace(/filePath = '\/app\/page\.html';/g, "filePath = '/index.html';");
serverCode = serverCode.replace(/filePath = '\/app\/about-us\/page\.html';/g, "filePath = '/about-us.html';");
serverCode = serverCode.replace(/filePath = '\/app\/coming-soon\/page\.html';/g, "filePath = '/coming-soon.html';");
serverCode = serverCode.replace(/filePath = '\/app\/contacts-us\/page\.html';/g, "filePath = '/contacts-us.html';");
fs.writeFileSync('server.js', serverCode);
console.log('Updated server.js');
