const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({ headless: "new" });
  const pageNext = await browser.newPage();
  const pageHtml = await browser.newPage();
  
  await pageNext.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  await pageHtml.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  const getNodes = async (page) => page.evaluate(() => {
    return Array.from(document.querySelectorAll('body *'))
      .filter(el => {
        if(el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;
        return true;
      })
      .map(el => el.tagName);
  });

  const nextNodes = await getNodes(pageNext);
  const htmlNodes = await getNodes(pageHtml);

  for(let i=0; i<Math.max(nextNodes.length, htmlNodes.length); i++) {
    if (nextNodes[i] !== htmlNodes[i]) {
      console.log(`Mismatch at index ${i}:`);
      console.log(`  Next.js: ${nextNodes[i] || 'MISSING'}`);
      console.log(`  HTML:    ${htmlNodes[i] || 'MISSING'}`);
      
      console.log(`\nNext 5 Next.js: ${nextNodes.slice(i, i+5).join(', ')}`);
      console.log(`Next 5 HTML:    ${htmlNodes.slice(i, i+5).join(', ')}`);
      break;
    }
  }

  await browser.close();
}
run();
