const fs = require('fs');

const updateLinks = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/href="\/coming-soon"/g, 'href="/coming-soon/page.html"');
  content = content.replace(/href="\/about-us"/g, 'href="/about-us/page.html"');
  content = content.replace(/href="\/contacts-us"/g, 'href="/contacts-us/page.html"');
  fs.writeFileSync(filePath, content);
};

updateLinks('app/page.html');
updateLinks('app/about-us/page.html');
updateLinks('app/coming-soon/page.html');
updateLinks('app/contacts-us/page.html');
