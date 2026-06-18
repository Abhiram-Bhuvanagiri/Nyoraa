const fs = require('fs');

const filesToUpdate = [
  'index.html',
  'about-us.html',
  'contacts-us.html',
  'coming-soon.html',
  'components/Navbar.html',
  'components/Footer.html',
  'components/Bubbles.html',
  'globals.css'
];

filesToUpdate.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');

  // Update asset paths
  const oldPrefixes = ['/brands/', '/coming-soon/', '/products/', '/logo.png', '/coming-soon.svg', '/combo.webp', '/Faceswash.webp', '/face_serum_bottle.webp', '/Mositruizer.webp', '/purity_lab.png', '/sunscreen.webp'];

  oldPrefixes.forEach(prefix => {
    // For regex replacement we need to be careful.
    // Replace "/logo.png" with "/assets/logo.png"
    // Replace "/brands/hueglam.png" with "/assets/brands/hueglam.png"
    if (prefix.endsWith('/')) {
      // It's a directory
      const regex = new RegExp(`(["'\\(])${prefix}`, 'g');
      c = c.replace(regex, `$1/assets${prefix}`);
    } else {
      // It's a file
      const regex = new RegExp(`(["'\\(])${prefix}(["'\\)])`, 'g');
      c = c.replace(regex, `$1/assets${prefix}$2`);
    }
  });

  // Update GSAP initialization to window.load
  c = c.replace(/document\.addEventListener\('DOMContentLoaded'/g, "window.addEventListener('load'");
  c = c.replace(/document\.addEventListener\("DOMContentLoaded"/g, "window.addEventListener('load'");

  fs.writeFileSync(f, c);
  console.log(`Updated ${f}`);
});
