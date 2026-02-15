const fs = require('fs');
const speakers = JSON.parse(fs.readFileSync('speakers.json', 'utf8'));
const allProducts = [...speakers.tops, ...speakers.subs];
const getPrice = (id) => allProducts.find(p => p.id === id)?.price || 0;

const calcSystem = (sys) => {
  if (!sys.tops) return { price: 0, tops: [], subs: [] };
  const topsPrice = sys.tops.reduce((s, id) => s + getPrice(id), 0);
  const subsPrice = sys.subs.reduce((s, id) => s + getPrice(id), 0);
  return { 
    price: topsPrice + subsPrice,
    tops: [...new Set(sys.tops)],
    subs: [...new Set(sys.subs)]
  };
};

// Read the matrix from app.js
const appJs = fs.readFileSync('app.js', 'utf8');
const matrixStart = appJs.indexOf('const DECISION_MATRIX = {');
const matrixEnd = appJs.indexOf('};', matrixStart) + 2;
const matrixCode = appJs.slice(matrixStart, matrixEnd);
eval(matrixCode);

const crowds = ['tiny', 'small', 'medium', 'large', 'xlarge', 'massive'];
const genres = ['deep', 'some', 'less', 'mixed'];

console.log('MATRIX AUDIT - Checking for issues\n');
console.log('Issues: Same tops across tiers, >2x delta, <1.2x delta\n');

let issues = [];

for (const crowd of crowds) {
  for (const genre of genres) {
    const matrix = DECISION_MATRIX[crowd]?.[genre];
    if (!matrix) continue;
    
    const bangs = calcSystem(matrix.bangs);
    const knocks = calcSystem(matrix.knocks);
    const destroys = matrix.destroys.system ? null : calcSystem(matrix.destroys);
    
    if (!destroys) continue; // Skip preset systems like Stackatoa
    
    const knocksBangsRatio = (knocks.price / bangs.price).toFixed(2);
    const destroysKnocksRatio = (destroys.price / knocks.price).toFixed(2);
    
    // Check for same tops across all tiers
    const bangsTops = bangs.tops.join(',');
    const knocksTops = knocks.tops.join(',');
    const destroysTops = destroys.tops.join(',');
    const sameTops = bangsTops === knocksTops && knocksTops === destroysTops;
    
    // Check ratios
    const wideDestroys = destroys.price > knocks.price * 2;
    const tooClose = knocks.price < bangs.price * 1.15 || destroys.price < knocks.price * 1.15;
    
    if (sameTops || wideDestroys || tooClose) {
      console.log(`⚠️  ${crowd}/${genre}`);
      console.log(`   Bangs:    $${bangs.price.toLocaleString().padStart(7)} | ${bangsTops}`);
      console.log(`   Knocks:   $${knocks.price.toLocaleString().padStart(7)} | ${knocksTops} (${knocksBangsRatio}× bangs)`);
      console.log(`   Destroys: $${destroys.price.toLocaleString().padStart(7)} | ${destroysTops} (${destroysKnocksRatio}× knocks)`);
      if (sameTops) console.log(`   ❌ Same tops across all tiers`);
      if (wideDestroys) console.log(`   ❌ Destroys > 2× Knocks`);
      if (tooClose) console.log(`   ⚠️  Tiers too close (<1.15×)`);
      console.log('');
      issues.push({ crowd, genre, sameTops, wideDestroys, tooClose });
    }
  }
}

console.log(`\nFound ${issues.length} scenarios with issues.`);
