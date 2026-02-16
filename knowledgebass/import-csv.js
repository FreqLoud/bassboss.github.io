#!/usr/bin/env node
/**
 * Import Zoho KB CSV to Knowledge BASS JSON format
 * 
 * Usage: node import-csv.js path/to/zoho-export.csv
 * 
 * This script converts Zoho Desk KB export to our JSON format.
 */

const fs = require('fs');
const path = require('path');

// Category ID mapping (update these based on your Zoho export)
const CATEGORY_KEYWORDS = {
  'operation': ['preset', 'eq', 'dsp', 'setup', 'connection', 'signal', 'power', 'amp', 'output', 'input', 'cable'],
  'videos': ['video', 'youtube', 'watch', 'tutorial'],
  'service': ['repair', 'warranty', 'service', 'maintenance', 'clean', 'fix', 'troubleshoot', 'issue', 'problem', 'broken'],
  'general': ['dealer', 'buy', 'purchase', 'price', 'order', 'ship', 'country', 'sell'],
  'askdavid': ['david', 'frequency', 'acoustic', 'physics', 'design', 'why', 'theory'],
  'apparel': ['shirt', 'banner', 'merch', 'apparel', 'logo', 'swag', 'wear'],
  'mk3': ['mk3', 'controlbass', 'firmware', 'ethernet', 'software', 'update', 'preset']
};

function detectCategory(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  
  let bestMatch = 'general';
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter(kw => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }
  
  return bestMatch;
}

function formatContent(text) {
  if (!text) return '';
  
  let formatted = text;
  
  // Preserve and clean line breaks
  formatted = formatted
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  
  // Convert URLs to markdown links (but keep them visible)
  // Match URLs that aren't already in markdown format
  const urlRegex = /(?<!\[.*?)(?<!\()(https?:\/\/[^\s\)<>]+)/gi;
  formatted = formatted.replace(urlRegex, (url) => {
    // Clean trailing punctuation
    let cleanUrl = url.replace(/[.,;:!?)]+$/, '');
    return `[${cleanUrl}](${cleanUrl})`;
  });
  
  // Detect and format bullet points (lines starting with - or *)
  formatted = formatted.replace(/^[\s]*[-*•]\s+/gm, '• ');
  
  // Detect numbered lists
  formatted = formatted.replace(/^[\s]*(\d+)[.)]\s+/gm, '$1. ');
  
  // Clean up HTML entities
  formatted = formatted
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/Â/g, '')  // Common encoding artifact
    .replace(/â€™/g, "'")
    .replace(/â€"/g, '—')
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/Ã©/g, 'é')
    .replace(/Ã±/g, 'ñ');
  
  // Remove HTML tags but try to preserve structure
  formatted = formatted
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/?(strong|b)>/gi, '**')
    .replace(/<\/?(em|i)>/gi, '_')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/?(ul|ol)>/gi, '\n')
    .replace(/<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '');  // Strip remaining tags
  
  // Clean up excessive whitespace
  formatted = formatted
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
  
  return formatted;
}

function extractTags(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  const tags = [];
  
  // Product names
  const products = ['sv9', 'diamon', 'dv12', 'at212', 'at312', 'mfla', 'krakatoa', 
                    'bb15', 'dj18s', 'ssp118', 'ssp215', 'ssp218', 'vs21', 'zv28', 
                    'makara', 'kraken', 'sublim8', 'ccm12'];
  products.forEach(p => {
    if (text.includes(p)) tags.push(p.toUpperCase());
  });
  
  // Common topics
  const topics = ['preset', 'firmware', 'warranty', 'shipping', 'wiring', 'dsp', 'controlbass'];
  topics.forEach(t => {
    if (text.includes(t)) tags.push(t);
  });
  
  return [...new Set(tags)].slice(0, 5);
}

// Extract URLs from content for reference
function extractUrls(text) {
  const urlRegex = /https?:\/\/[^\s\)<>]+/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches.map(u => u.replace(/[.,;:!?)]+$/, '')))];
}

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = parseCSVLine(lines[0]);
  const articles = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    
    // Only include published articles
    if (row['Status'] !== 'Published') continue;
    
    const title = row['Article Title'] || '';
    const rawContent = row['Answer'] || '';
    const content = formatContent(rawContent);
    
    if (!title || !content) continue;
    
    // Detect language (simple heuristic)
    const spanishWords = ['el', 'la', 'los', 'las', 'de', 'que', 'en', 'es', 'por', 'con', 'para'];
    const words = content.toLowerCase().split(/\s+/).slice(0, 50);
    const spanishCount = words.filter(w => spanishWords.includes(w)).length;
    const isSpanish = spanishCount > 5;
    
    articles.push({
      id: row['ID'] || String(i),
      title: title.trim(),
      content: content,
      category: detectCategory(title, content),
      tags: extractTags(title, content),
      urls: extractUrls(rawContent),
      likes: parseInt(row['Like Count']) || 0,
      created: row['Created Time']?.split(' ')[0] || null,
      language: isSpanish ? 'es' : 'en',
      zohoCategory: row['Category'] || null  // Keep original for reference
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
const csvPath = process.argv[2] || '/tmp/zoho-kb-export.csv';
const outputPath = process.argv[3] || './data/articles.json';

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found: ${csvPath}`);
  process.exit(1);
}

console.log(`Reading: ${csvPath}`);
const csvText = fs.readFileSync(csvPath, 'utf-8');

console.log('Parsing CSV...');
const articles = parseCSV(csvText);

// Filter out Spanish articles by default
const englishArticles = articles.filter(a => a.language === 'en');
const spanishArticles = articles.filter(a => a.language === 'es');

console.log(`Found ${articles.length} published articles`);
console.log(`  English: ${englishArticles.length}`);
console.log(`  Spanish: ${spanishArticles.length} (excluded)`);

// Category breakdown
const catCounts = {};
englishArticles.forEach(a => {
  catCounts[a.category] = (catCounts[a.category] || 0) + 1;
});
console.log('\nCategory breakdown (English only):');
Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

// URL stats
const articlesWithUrls = englishArticles.filter(a => a.urls.length > 0);
console.log(`\nArticles with URLs: ${articlesWithUrls.length}`);

// Write output
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(englishArticles, null, 2));
console.log(`\nWritten to: ${outputPath}`);

// Also write Spanish articles separately if any
if (spanishArticles.length > 0) {
  const spanishPath = outputPath.replace('.json', '-spanish.json');
  fs.writeFileSync(spanishPath, JSON.stringify(spanishArticles, null, 2));
  console.log(`Spanish articles: ${spanishPath}`);
}
