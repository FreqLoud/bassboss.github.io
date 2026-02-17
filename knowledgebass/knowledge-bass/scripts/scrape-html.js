#!/usr/bin/env node
/**
 * Scrape HTML content from help.bassboss.com articles
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '..', 'data', 'articles.json');
const outputPath = path.join(__dirname, '..', 'data', 'articles-formatted.json');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function extractContent(html) {
  // Find content between seoBodyContent and script tag
  const startMarker = '<div id="seoBodyContent">';
  const endMarker = '<script';
  
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return null;
  
  const contentStart = startIdx + startMarker.length;
  const endIdx = html.indexOf(endMarker, contentStart);
  if (endIdx === -1) return null;
  
  let content = html.slice(contentStart, endIdx);
  
  // Clean up the HTML
  content = content
    // Remove the h1 title (we already have it)
    .replace(/<div><div><h1>.*?<\/h1><\/div>/s, '')
    // Remove "Related Articles" section
    .replace(/<ul><li><h1>Related Articles<\/h1>[\s\S]*?<\/ul>/g, '')
    // Remove empty wrapper divs at start
    .replace(/^<div><div>/, '')
    // Remove trailing divs and whitespace
    .replace(/<\/div>\s*<\/div>\s*$/, '')
    // Clean up multiple br tags
    .replace(/(<br\s*\/?>\s*){3,}/g, '<br><br>')
    .trim();
  
  return content;
}

function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/^video\s*[|\-:]\s*/i, '')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

async function scrapeArticle(article, index, total) {
  const slug = titleToSlug(article.title);
  const url = `https://help.bassboss.com/portal/en/kb/articles/${slug}`;
  
  try {
    process.stdout.write(`[${index + 1}/${total}] ${article.title.slice(0, 45).padEnd(45)}... `);
    const html = await fetchUrl(url);
    const content = extractContent(html);
    
    if (content && content.length > 50) {
      console.log(`✅ ${content.length} chars`);
      return { ...article, htmlContent: content, sourceUrl: url };
    } else {
      console.log(`⚠️ no content`);
      return article;
    }
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return article;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Loading articles...');
  const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  const articles = data.articles;
  
  console.log(`Scraping ${articles.length} articles from help.bassboss.com...\n`);
  
  const results = [];
  let successCount = 0;
  
  for (let i = 0; i < articles.length; i++) {
    const result = await scrapeArticle(articles[i], i, articles.length);
    results.push(result);
    
    if (result.htmlContent) successCount++;
    
    // Rate limit: 150ms between requests
    if (i < articles.length - 1) await sleep(150);
  }
  
  console.log(`\n✅ Done! ${successCount}/${articles.length} articles with HTML content`);
  
  const output = {
    ...data,
    articles: results,
    scrapedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Written to ${outputPath}`);
}

main().catch(console.error);
