const fs = require('fs');

const files = [
  'app/page.html',
  'app/about-us/page.html',
  'app/contacts-us/page.html'
];

files.forEach(f => {
  if(!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  
  // Find the tailwind config block
  const configMatch = c.match(/<script>\s*tailwind\.config = [\s\S]*?<\/script>/);
  const cdnMatch = c.match(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/);
  
  if (configMatch && cdnMatch) {
    // Remove both
    c = c.replace(configMatch[0], '');
    c = c.replace(cdnMatch[0], '');
    
    // Insert them in the correct order (CDN first, then config) right before the first <script src="https://cdnjs
    const insertString = `<script src="https://cdn.tailwindcss.com"></script>\n  ${configMatch[0]}\n`;
    
    // find </title> or </style> or similar to inject into head
    c = c.replace('</head>', insertString + '\n</head>');
    
    fs.writeFileSync(f, c);
    console.log(f + ' updated');
  }
});
