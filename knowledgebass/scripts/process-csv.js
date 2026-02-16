#!/usr/bin/env node
/**
 * Process Zoho KB export CSV into clean JSON for Knowledge BASS
 */

const fs = require('fs');
const path = require('path');

// Category mapping based on keywords in title/content
const categoryRules = [
  // 🛒 CHOOSING YOUR SYSTEM
  { pattern: /\bvs\b|versus|compare|comparison|which.*right|should i (get|buy|choose)/i, category: 'choosing', subcategory: 'comparisons' },
  { pattern: /system.*siz|how (many|much).*need|ratio|crowd|event size/i, category: 'choosing', subcategory: 'sizing' },
  
  // 📦 BUYING & ORDERS
  { pattern: /where.*buy|dealer|pricing|price|financing|finexchange/i, category: 'buying', subcategory: 'dealers' },
  { pattern: /track.*order|shipping|delivery|outside.*usa|international|countries/i, category: 'buying', subcategory: 'orders' },
  { pattern: /become.*dealer/i, category: 'buying', subcategory: 'dealers' },
  
  // 🔧 SETUP & INSTALLATION
  { pattern: /mount|pole|bracket|k&m|stand|tripod/i, category: 'setup', subcategory: 'mounting' },
  { pattern: /power.*strip|daisy.*chain|power.*supply|voltage|120v|240v/i, category: 'setup', subcategory: 'power' },
  { pattern: /connect|cable|xlr|powercon|signal.*chain/i, category: 'setup', subcategory: 'connections' },
  { pattern: /gain.*structure|input.*sensitivity|level|set.*up/i, category: 'setup', subcategory: 'levels' },
  
  // 🎛️ OPERATION
  { pattern: /controlbass|mk3.*feature|preset|dsp|curve/i, category: 'operation', subcategory: 'controlbass' },
  { pattern: /power.*draw|current|amp|watt|electrical/i, category: 'operation', subcategory: 'electrical' },
  { pattern: /ip.*rating|weather|rain|outdoor|heat|temperature/i, category: 'operation', subcategory: 'environment' },
  { pattern: /turntable|vinyl|record/i, category: 'operation', subcategory: 'turntables' },
  { pattern: /mixer|mix.*board|aux|signal/i, category: 'operation', subcategory: 'mixing' },
  
  // 🛠️ SERVICE & MAINTENANCE
  { pattern: /repair|service|warranty|problem|issue|fix/i, category: 'service', subcategory: 'repairs' },
  { pattern: /touch.*up|paint|scratch|clean/i, category: 'service', subcategory: 'care' },
  { pattern: /replace|screw|grille|lamp|bulb|driver.*remov/i, category: 'service', subcategory: 'parts' },
  { pattern: /error|code|light|flash|protect|limit|troubleshoot/i, category: 'service', subcategory: 'troubleshooting' },
  { pattern: /serial.*number|mk1|mk2|mk3.*identify|generation/i, category: 'service', subcategory: 'identification' },
  
  // 🎒 ACCESSORIES
  { pattern: /cover|case|tuki|under.*cover/i, category: 'accessories', subcategory: 'covers' },
  { pattern: /cart|wheel|caster|transport/i, category: 'accessories', subcategory: 'transport' },
  { pattern: /banner|apparel|shirt|merch/i, category: 'accessories', subcategory: 'merch' },
  { pattern: /shorty|pole.*cup|hardware/i, category: 'accessories', subcategory: 'hardware' },
  
  // 🎓 LEARN FROM DAVID LEE
  { pattern: /below.*20.*hz|infra|subsonic|deep.*bass|wavelength|frequency.*range/i, category: 'learn', subcategory: 'technical' },
  { pattern: /why.*bassboss|philosophy|design.*decision|who.*david/i, category: 'learn', subcategory: 'philosophy' },
  { pattern: /thermal.*compress|physics|acoustic|science/i, category: 'learn', subcategory: 'technical' },
  
  // 🎬 VIDEOS (explicit video articles)
  { pattern: /^video\s*[|\-:]/i, category: 'videos', subcategory: 'general' },
];

// Category metadata
const categories = {
  choosing: { emoji: '🛒', name: 'Choosing Your System', order: 1 },
  buying: { emoji: '📦', name: 'Buying & Orders', order: 2 },
  setup: { emoji: '🔧', name: 'Setup & Installation', order: 3 },
  operation: { emoji: '🎛️', name: 'Operation', order: 4 },
  service: { emoji: '🛠️', name: 'Service & Maintenance', order: 5 },
  accessories: { emoji: '🎒', name: 'Accessories', order: 6 },
  learn: { emoji: '🎓', name: 'Learn from David Lee', order: 7 },
  videos: { emoji: '🎬', name: 'Videos', order: 8 },
  general: { emoji: '📄', name: 'General', order: 9 },
};

function categorize(title, content) {
  const text = `${title} ${content}`;
  
  for (const rule of categoryRules) {
    if (rule.pattern.test(text)) {
      return { category: rule.category, subcategory: rule.subcategory };
    }
  }
  
  return { category: 'general', subcategory: 'uncategorized' };
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/‚Äô/g, "'")
    .replace(/‚Äú/g, '"')
    .replace(/‚Äù/g, '"')
    .replace(/‚Äî/g, '—')
    .replace(/‚Äì/g, '–')
    .replace(/‚Ä¶/g, '...')
    .replace(/√©/g, 'é')
    .replace(/√°/g, 'á')
    .replace(/√≠/g, 'í')
    .replace(/√≥/g, 'ó')
    .replace(/√∫/g, 'ú')
    .replace(/√±/g, 'ñ')
    .replace(/ª/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  const articles = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    
    // Only include published articles
    if (row['Status'] !== 'Published' && row['Article Status'] !== 'Published') {
      continue;
    }
    
    const title = cleanText(row['Article Title']);
    const content = cleanText(row['Answer']);
    
    if (!title || !content) continue;
    
    const { category, subcategory } = categorize(title, content);
    const isVideo = /^video\s*[|\-:]/i.test(title) || content.toLowerCase().includes('video');
    
    articles.push({
      id: row['ID'],
      title: title,
      content: content,
      category: category,
      subcategory: subcategory,
      isVideo: isVideo,
      likes: parseInt(row['Like Count']) || 0,
      createdAt: row['Created Time'],
      updatedAt: row['Modified Time'],
      // Generate a slug from the title
      slug: title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60),
    });
  }
  
  return articles;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  
  return values;
}

// Main
const csvPath = '/tmp/zoho-kb-export.csv';
const outputPath = path.join(__dirname, '..', 'data', 'articles.json');

console.log('Reading CSV...');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

console.log('Parsing articles...');
const articles = parseCSV(csvContent);

console.log(`Found ${articles.length} published articles`);

// Count by category
const byCat = {};
articles.forEach(a => {
  byCat[a.category] = (byCat[a.category] || 0) + 1;
});
console.log('\nBy category:');
Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  const meta = categories[cat];
  console.log(`  ${meta.emoji} ${meta.name}: ${count}`);
});

// Write output
const output = {
  generatedAt: new Date().toISOString(),
  totalArticles: articles.length,
  categories: categories,
  articles: articles.sort((a, b) => {
    // Sort by category order, then by likes (descending), then by title
    const catDiff = categories[a.category].order - categories[b.category].order;
    if (catDiff !== 0) return catDiff;
    if (b.likes !== a.likes) return b.likes - a.likes;
    return a.title.localeCompare(b.title);
  }),
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\nWritten to ${outputPath}`);
