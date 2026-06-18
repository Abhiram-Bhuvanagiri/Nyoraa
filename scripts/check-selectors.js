const fs = require('fs');
const content = fs.readFileSync('app/about-us/page.html', 'utf8');

const selectors = [
  'aquatic-swiper',
  '\\br\\b',
  '\\br-left\\b',
  '\\br-right\\b',
  '\\br-scale\\b',
  '\\bvwr-word\\b',
  '\\bvision-word-reveal\\b',
  '\\bteam-card\\b',
  'id="leadership"',
  '\\bteam-grid\\b',
  '\\bcard\\b',
  'id="vision"',
  '\\bpage-content\\b',
  'id="about-cta"',
  '\\bcta-tagline\\b',
  'id="c3"',
  'id="h3"',
  'id="p3"',
  'id="b3"',
  'id="serifRef"',
  'id="italicRef"',
  'id="headerRef"',
  '\\bfounder-card\\b',
  '\\bp-dot\\b',
  '\\bparticles\\b'
];

selectors.forEach(s => {
  let regex;
  if (s.startsWith('id=')) {
    regex = new RegExp(s);
  } else {
    regex = new RegExp('class="[^"]*' + s + '[^"]*"');
  }
  console.log(s, regex.test(content));
});
