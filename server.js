const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Helper to determine content type
const getContentType = (filePath) => {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html': return 'text/html';
    case '.js': return 'text/javascript';
    case '.css': return 'text/css';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': return 'image/jpg';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
};

const server = http.createServer((req, res) => {
  console.log(`[REQ] ${req.method} ${req.url}`);

  let filePath = req.url;

  // Custom Routing to map Next.js paths to our generated HTML files
  if (filePath === '/' || filePath === '/index.html' || filePath === '/page.html') {
    filePath = '/app/page.html';
  } else if (filePath === '/about-us' || filePath === '/about-us/page.html') {
    filePath = '/app/about-us/page.html';
  } else if (filePath === '/coming-soon' || filePath === '/coming-soon/page.html') {
    filePath = '/app/coming-soon/page.html';
  } else if (filePath === '/contacts-us' || filePath === '/contacts-us/page.html') {
    filePath = '/app/contacts-us/page.html';
  }

  // Attempt to resolve file from root first, then fallback to /public
  let absolutePath = path.join(__dirname, filePath);

  if (!fs.existsSync(absolutePath)) {
    // If not found, check the public folder (for images, fonts, etc.)
    absolutePath = path.join(__dirname, 'public', filePath);
  }

  // Auto-append .html if looking for a component (e.g. /app/components/Navbar.html)
  if (!fs.existsSync(absolutePath) && fs.existsSync(absolutePath + '.html')) {
    absolutePath += '.html';
  }

  fs.readFile(absolutePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': getContentType(absolutePath) });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Local Server running at: http://localhost:${PORT}`);
  console.log(`\nPress Ctrl+C to stop.`);
});
