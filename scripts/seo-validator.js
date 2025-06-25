#!/usr/bin/env node

/**
 * SEO Validation Script
 * 
 * This script helps validate basic SEO requirements for the website.
 * Run with: node scripts/seo-validator.js
 */

const fs = require('fs');
const path = require('path');

// SEO Requirements Checklist
const seoRequirements = {
  'index.html': {
    'meta charset': 'UTF-8',
    'meta viewport': 'width=device-width, initial-scale=1.0',
    'meta description': 'exists',
    'meta keywords': 'exists',
    'title tag': 'exists',
    'canonical link': 'exists',
    'manifest link': 'exists',
    'structured data': 'exists'
  },
  'public/sitemap.xml': {
    'file exists': true,
    'valid XML': true,
    'contains URLs': true
  },
  'public/robots.txt': {
    'file exists': true,
    'contains sitemap': true,
    'allows crawling': true
  },
  'public/manifest.json': {
    'file exists': true,
    'valid JSON': true,
    'contains required fields': true
  }
};

// Component SEO Requirements
const componentRequirements = {
  'src/components/SEO.tsx': {
    'file exists': true,
    'exports SEO component': true,
    'handles meta tags': true,
    'handles structured data': true
  }
};

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return '';
  }
}

function validateHTMLFile(filePath) {
  const content = readFileContent(filePath);
  const checks = seoRequirements[filePath];
  const results = {};

  for (const [check, expected] of Object.entries(checks)) {
    switch (check) {
      case 'meta charset':
        results[check] = content.includes('charset="UTF-8"');
        break;
      case 'meta viewport':
        results[check] = content.includes('viewport') && content.includes('width=device-width');
        break;
      case 'meta description':
        results[check] = content.includes('name="description"');
        break;
      case 'meta keywords':
        results[check] = content.includes('name="keywords"');
        break;
      case 'title tag':
        results[check] = content.includes('<title>') && content.includes('</title>');
        break;
      case 'canonical link':
        results[check] = content.includes('rel="canonical"');
        break;
      case 'manifest link':
        results[check] = content.includes('rel="manifest"');
        break;
      case 'structured data':
        results[check] = content.includes('application/ld+json');
        break;
    }
  }

  return results;
}

function validateXMLFile(filePath) {
  const content = readFileContent(filePath);
  const checks = seoRequirements[filePath];
  const results = {};

  for (const [check, expected] of Object.entries(checks)) {
    switch (check) {
      case 'file exists':
        results[check] = checkFileExists(filePath);
        break;
      case 'valid XML':
        results[check] = content.includes('<?xml') && content.includes('<urlset');
        break;
      case 'contains URLs':
        results[check] = content.includes('<loc>') && content.includes('</loc>');
        break;
    }
  }

  return results;
}

function validateJSONFile(filePath) {
  const content = readFileContent(filePath);
  const checks = seoRequirements[filePath];
  const results = {};

  for (const [check, expected] of Object.entries(checks)) {
    switch (check) {
      case 'file exists':
        results[check] = checkFileExists(filePath);
        break;
      case 'valid JSON':
        try {
          JSON.parse(content);
          results[check] = true;
        } catch (error) {
          results[check] = false;
        }
        break;
      case 'contains required fields':
        const parsed = JSON.parse(content);
        results[check] = parsed.name && parsed.short_name && parsed.start_url;
        break;
    }
  }

  return results;
}

function validateTextFile(filePath) {
  const content = readFileContent(filePath);
  const checks = seoRequirements[filePath];
  const results = {};

  for (const [check, expected] of Object.entries(checks)) {
    switch (check) {
      case 'file exists':
        results[check] = checkFileExists(filePath);
        break;
      case 'contains sitemap':
        results[check] = content.includes('Sitemap:');
        break;
      case 'allows crawling':
        results[check] = content.includes('Allow: /');
        break;
    }
  }

  return results;
}

function validateComponent(filePath) {
  const content = readFileContent(filePath);
  const checks = componentRequirements[filePath];
  const results = {};

  for (const [check, expected] of Object.entries(checks)) {
    switch (check) {
      case 'file exists':
        results[check] = checkFileExists(filePath);
        break;
      case 'exports SEO component':
        results[check] = content.includes('export default SEO');
        break;
      case 'handles meta tags':
        results[check] = content.includes('Helmet') && content.includes('meta');
        break;
      case 'handles structured data':
        results[check] = content.includes('application/ld+json');
        break;
    }
  }

  return results;
}

function printResults(filePath, results) {
  console.log(`\n📁 ${filePath}:`);
  console.log('─'.repeat(50));
  
  let passed = 0;
  let total = 0;

  for (const [check, result] of Object.entries(results)) {
    total++;
    const status = result ? '✅' : '❌';
    console.log(`${status} ${check}: ${result ? 'PASS' : 'FAIL'}`);
    if (result) passed++;
  }

  console.log(`\n📊 ${passed}/${total} checks passed`);
  return { passed, total };
}

function main() {
  console.log('🔍 SEO Validation Report');
  console.log('='.repeat(50));

  let totalPassed = 0;
  let totalChecks = 0;

  // Validate HTML files
  const htmlResults = validateHTMLFile('index.html');
  const htmlStats = printResults('index.html', htmlResults);
  totalPassed += htmlStats.passed;
  totalChecks += htmlStats.total;

  // Validate XML files
  const sitemapResults = validateXMLFile('public/sitemap.xml');
  const sitemapStats = printResults('public/sitemap.xml', sitemapResults);
  totalPassed += sitemapStats.passed;
  totalChecks += sitemapStats.total;

  // Validate robots.txt
  const robotsResults = validateTextFile('public/robots.txt');
  const robotsStats = printResults('public/robots.txt', robotsResults);
  totalPassed += robotsStats.passed;
  totalChecks += robotsStats.total;

  // Validate manifest.json
  const manifestResults = validateJSONFile('public/manifest.json');
  const manifestStats = printResults('public/manifest.json', manifestResults);
  totalPassed += manifestStats.passed;
  totalChecks += manifestStats.total;

  // Validate SEO component
  const seoComponentResults = validateComponent('src/components/SEO.tsx');
  const seoComponentStats = printResults('src/components/SEO.tsx', seoComponentResults);
  totalPassed += seoComponentStats.passed;
  totalChecks += seoComponentStats.total;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalChecks - totalPassed}`);
  console.log(`Success Rate: ${((totalPassed / totalChecks) * 100).toFixed(1)}%`);

  if (totalPassed === totalChecks) {
    console.log('\n🎉 All SEO checks passed! Your website is well-optimized.');
  } else {
    console.log('\n⚠️  Some SEO checks failed. Please review the issues above.');
  }

  console.log('\n💡 Next Steps:');
  console.log('1. Replace "your-domain.com" with your actual domain');
  console.log('2. Add actual images for Open Graph and Twitter Cards');
  console.log('3. Set up Google Search Console');
  console.log('4. Monitor performance with Lighthouse');
}

if (require.main === module) {
  main();
}

module.exports = {
  validateHTMLFile,
  validateXMLFile,
  validateJSONFile,
  validateTextFile,
  validateComponent
}; 