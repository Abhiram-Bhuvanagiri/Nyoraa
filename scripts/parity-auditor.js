const puppeteer = require('puppeteer');
const fs = require('fs');

const NEXT_URL = 'http://localhost:3001'; // Next.js
const HTML_URL = 'http://localhost:3000'; // HTML Conversion

const BREAKPOINTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Laptop', width: 1024, height: 768 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Ultrawide', width: 2560, height: 1440 },
];

const PROPS_TO_COMPARE = [
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 
  'color', 'opacity', 'width', 'height', 'margin', 'padding', 'gap', 
  'borderRadius', 'transform', 'translate', 'scale', 'top', 'left', 'right', 'bottom', 'zIndex'
];

async function extractStyles(page) {
  return await page.evaluate((props) => {
    const data = [];
    const elements = document.querySelectorAll('body *');
    elements.forEach((el, i) => {
      // Exclude hidden elements and scripts
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      
      const computed = window.getComputedStyle(el);
      const styles = {};
      props.forEach(p => styles[p] = computed[p]);
      
      // Identify element uniquely (tag + id + class logic or path)
      const id = el.id ? `#${el.id}` : '';
      const classes = el.className && typeof el.className === 'string' ? `.${el.className.split(' ').join('.')}` : '';
      data.push({
        tag: el.tagName.toLowerCase(),
        id,
        classes: classes.substring(0, 100), // truncate long tailwind classes
        rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left },
        styles
      });
    });
    return data;
  }, PROPS_TO_COMPARE);
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: "new" });
  
  const report = {};

  for (const bp of BREAKPOINTS) {
    console.log(`\nTesting Breakpoint: ${bp.name} (${bp.width}x${bp.height})`);
    const pageNext = await browser.newPage();
    const pageHtml = await browser.newPage();
    
    await pageNext.setViewport({ width: bp.width, height: bp.height });
    await pageHtml.setViewport({ width: bp.width, height: bp.height });

    console.log(`  Loading Next.js...`);
    await pageNext.goto(NEXT_URL, { waitUntil: 'networkidle2' });
    
    console.log(`  Loading HTML...`);
    await pageHtml.goto(HTML_URL, { waitUntil: 'networkidle2' });

    console.log(`  Extracting styles...`);
    const nextStyles = await extractStyles(pageNext);
    const htmlStyles = await extractStyles(pageHtml);

    // Compare
    const mismatches = [];
    const minLen = Math.min(nextStyles.length, htmlStyles.length);
    if (nextStyles.length !== htmlStyles.length) {
       console.warn(`  DOM node count mismatch! Next: ${nextStyles.length}, HTML: ${htmlStyles.length}`);
       mismatches.push({ error: `DOM Node Count Mismatch: Next: ${nextStyles.length}, HTML: ${htmlStyles.length}` });
    }

    for (let i = 0; i < minLen; i++) {
      const n = nextStyles[i];
      const h = htmlStyles[i];
      const diffs = {};
      
      for (const p of PROPS_TO_COMPARE) {
        if (n.styles[p] !== h.styles[p]) {
          diffs[p] = { original: n.styles[p], html: h.styles[p] };
        }
      }
      
      if (Object.keys(diffs).length > 0) {
        mismatches.push({
          element: `${n.tag}${n.id}${n.classes}`,
          index: i,
          differences: diffs
        });
      }
    }
    
    report[bp.name] = mismatches;
    await pageNext.close();
    await pageHtml.close();
  }

  await browser.close();
  
  fs.writeFileSync('parity_report.json', JSON.stringify(report, null, 2));
  console.log('\n✅ Audit Complete! See parity_report.json for details.');
}

run().catch(console.error);
