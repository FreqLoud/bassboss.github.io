#!/usr/bin/env node
/**
 * Smart-format plain text articles into HTML
 * Detects: tables, lists, links, Q&A, sections
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'data', 'articles.json');
const outputPath = path.join(__dirname, '..', 'data', 'articles.json');

function smartFormat(text, title) {
  let html = text;
  
  // 1. Escape HTML entities
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // 2. Detect and format URLs
  html = html.replace(
    /(https?:\/\/[^\s<]+)/g, 
    '<a href="$1" target="_blank" rel="noopener" class="text-bb-orange hover:underline">$1</a>'
  );
  
  // 3. Detect Q: and A: patterns (FAQ style)
  html = html.replace(/^Q:\s*(.+)/gm, '<p class="font-semibold text-white mt-4">Q: $1</p>');
  html = html.replace(/^A:\s*/gm, '<p class="text-gray-300">');
  
  // 4. Detect "See Also:" sections
  html = html.replace(/See Also:?\s*([\s\S]*?)(?=$|\n\n)/gi, (match, content) => {
    const items = content.trim().split(/\n/).filter(Boolean);
    const listItems = items.map(item => `<li>${item.trim()}</li>`).join('\n');
    return `<div class="mt-4 p-4 bg-gray-800/50 rounded-lg">
      <p class="font-semibold text-bb-orange mb-2">See Also:</p>
      <ul class="list-disc list-inside space-y-1 text-gray-300">${listItems}</ul>
    </div>`;
  });
  
  // 5. Detect Notes: sections
  html = html.replace(/Notes?:?\s*\n([\s\S]*?)(?=$|\n\n)/gi, (match, content) => {
    const items = content.trim().split(/\n/).filter(Boolean);
    const listItems = items.map(item => `<li>${item.trim()}</li>`).join('\n');
    return `<div class="mt-4 p-4 bg-yellow-900/20 border-l-4 border-bb-orange rounded-r-lg">
      <p class="font-semibold text-bb-orange mb-2">Notes:</p>
      <ul class="list-disc list-inside space-y-1 text-gray-300">${listItems}</ul>
    </div>`;
  });
  
  // 6. Detect product model mentions (BASSBOSS products)
  const models = ['SV9', 'DiaMon', 'DV12', 'CCM12', 'AT212', 'AT312', 'MFLA', 
                  'BB15', 'DJ18S', 'SSP118', 'SSP215', 'SSP218', 'VS21', 
                  'Makara', 'Kraken', 'Krakatoa', 'ZV28', 'MK2', 'MK3', 'MK1'];
  models.forEach(model => {
    const regex = new RegExp(`\\b(${model})\\b`, 'gi');
    html = html.replace(regex, '<strong class="text-white">$1</strong>');
  });
  
  // 7. Detect bullet points
  html = html.replace(/^[-•]\s*(.+)/gm, '<li class="ml-4">$1</li>');
  // Wrap consecutive li items in ul
  html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/g, '<ul class="list-disc list-inside space-y-1 my-2">$&</ul>');
  
  // 8. Detect numbered lists
  html = html.replace(/^\d+[.)]\s*(.+)/gm, '<li class="ml-4">$1</li>');
  
  // 9. Detect section headers (ALL CAPS or ending with :)
  html = html.replace(/^([A-Z][A-Z\s&]+):?\s*$/gm, '<h3 class="text-lg font-semibold text-bb-orange mt-6 mb-2">$1</h3>');
  
  // 10. Detect key:value patterns that might be table-like
  // Pattern: "Product: Value" or "Model: Description"
  const tablePattern = /^([A-Za-z0-9\s]+):\s*(.+)$/gm;
  let tableMatches = [...html.matchAll(tablePattern)];
  if (tableMatches.length >= 3) {
    // Might be a table-like structure
    html = html.replace(tablePattern, '<tr><td class="pr-4 py-1 text-gray-400">$1:</td><td class="py-1">$2</td></tr>');
    // Wrap in table
    html = html.replace(/(<tr>.*?<\/tr>\s*)+/gs, '<table class="w-full my-4 text-sm">$&</table>');
  }
  
  // 11. Convert double newlines to paragraph breaks
  html = html.replace(/\n\n+/g, '</p><p class="my-3 text-gray-300">');
  
  // 12. Wrap in initial paragraph if needed
  if (!html.startsWith('<')) {
    html = '<p class="text-gray-300">' + html;
  }
  if (!html.endsWith('>')) {
    html = html + '</p>';
  }
  
  // 13. Clean up empty paragraphs
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '');
  
  // 14. Add article title styling for video articles
  if (title.toLowerCase().includes('video')) {
    html = `<div class="mb-4 p-3 bg-bb-orange/10 border border-bb-orange/30 rounded-lg inline-block">
      <span class="text-bb-orange">🎬 This is a video article</span>
    </div>` + html;
  }
  
  return html;
}

async function main() {
  console.log('Loading articles...');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  
  console.log(`Formatting ${data.articles.length} articles...`);
  
  let formattedCount = 0;
  data.articles = data.articles.map(article => {
    const htmlContent = smartFormat(article.content, article.title);
    formattedCount++;
    return { ...article, htmlContent };
  });
  
  console.log(`✅ Formatted ${formattedCount} articles`);
  
  data.formattedAt = new Date().toISOString();
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Written to ${outputPath}`);
}

main().catch(console.error);
