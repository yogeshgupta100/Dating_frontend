#!/usr/bin/env node

/**
 * SEO Validation Script
 *
 * This script helps validate basic SEO requirements for the website.
 * Run with: node scripts/seo-validator.js
 */

const fs = require("fs");
const path = require("path");

// SEO Requirements for each file
const seoRequirements = {
  "src/app/layout.tsx": {
    "meta charset": true,
    "meta viewport": true,
    "meta description": true,
    "meta keywords": true,
    "title tag": "exists",
    "canonical link": "exists",
    "manifest link": "exists",
    "structured data": "exists",
  },
  "src/app/sitemap.ts": {
    "file exists": true,
    "exports sitemap function": true,
    "returns MetadataRoute.Sitemap": true,
    "includes static pages": true,
  },
  "src/app/robots.ts": {
    "file exists": true,
    "exports robots function": true,
    "references sitemap": true,
    "allows crawling": true,
  },
  "public/manifest.json": {
    "file exists": true,
    "valid JSON": true,
    "contains required fields": true,
  },
};

// Component SEO Requirements
const componentRequirements = {
  "src/components/SEO.tsx": {
    "file exists": true,
    "exports SEO component": true,
    "handles meta tags": true,
    "handles structured data": true,
  },
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
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return "";
  }
}

function validateHTMLFile(filePath) {
  const content = readFileContent(filePath);
  const checks = seoRequirements[filePath];
  const results = {};

  for (const [check, expected] of Object.entries(checks)) {
    switch (check) {
      case "meta charset":
        results[check] = content.includes('charset="UTF-8"');
        break;
      case "meta viewport":
        results[check] =
          content.includes("viewport") &&
          content.includes("width=device-width");
        break;
      case "meta description":
        results[check] = content.includes('name="description"');
        break;
      case "meta keywords":
        results[check] = content.includes('name="keywords"');
        break;
      case "title tag":
        results[check] =
          content.includes("<title>") && content.includes("</title>");
        break;
      case "canonical link":
        results[check] = content.includes('rel="canonical"');
        break;
      case "manifest link":
        results[check] = content.includes('rel="manifest"');
        break;
      case "structured data":
        results[check] = content.includes("application/ld+json");
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
      case "file exists":
        results[check] = checkFileExists(filePath);
        break;
      case "valid XML":
        results[check] =
          content.includes("<?xml") && content.includes("<urlset");
        break;
      case "contains URLs":
        results[check] =
          content.includes("<loc>") && content.includes("</loc>");
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
      case "file exists":
        results[check] = checkFileExists(filePath);
        break;
      case "valid JSON":
        try {
          JSON.parse(content);
          results[check] = true;
        } catch (error) {
          results[check] = false;
        }
        break;
      case "contains required fields":
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
      case "file exists":
        results[check] = checkFileExists(filePath);
        break;
      case "contains sitemap":
        results[check] = content.includes("Sitemap:");
        break;
      case "allows crawling":
        results[check] = content.includes("Allow: /");
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
      case "file exists":
        results[check] = checkFileExists(filePath);
        break;
      case "exports SEO component":
        results[check] = content.includes("export default SEO");
        break;
      case "handles meta tags":
        results[check] = content.includes("Helmet") && content.includes("meta");
        break;
      case "handles structured data":
        results[check] = content.includes("application/ld+json");
        break;
    }
  }

  return results;
}

function validateTypeScriptFile(filePath) {
  const content = readFileContent(filePath);
  const checks = seoRequirements[filePath];
  const results = {};

  for (const [check, expected] of Object.entries(checks)) {
    switch (check) {
      case "file exists":
        results[check] = checkFileExists(filePath);
        break;
      case "exports sitemap function":
        results[check] = content.includes(
          "export default async function sitemap"
        );
        break;
      case "returns MetadataRoute.Sitemap":
        results[check] = content.includes("MetadataRoute.Sitemap");
        break;
      case "includes static pages":
        results[check] =
          content.includes("staticPages") && content.includes("baseUrl");
        break;
      case "exports robots function":
        results[check] = content.includes("export default function robots");
        break;
      case "references sitemap":
        results[check] =
          content.includes("sitemap:") && content.includes("sitemap.xml");
        break;
      case "allows crawling":
        results[check] = content.includes("allow:") && content.includes("/");
        break;
    }
  }

  return results;
}

function printResults(filePath, results) {
  console.log(`\n📁 ${filePath}:`);
  console.log("─".repeat(50));

  let passed = 0;
  let total = 0;

  for (const [check, result] of Object.entries(results)) {
    total++;
    const status = result ? "✅" : "❌";
    console.log(`${status} ${check}: ${result ? "PASS" : "FAIL"}`);
    if (result) passed++;
  }

  console.log(`\n📊 ${passed}/${total} checks passed`);
  return { passed, total };
}

function main() {
  console.log("🔍 SEO Validation Report");
  console.log("=".repeat(50));

  let totalPassed = 0;
  let totalChecks = 0;

  // Validate layout.tsx
  const layoutResults = validateHTMLFile("src/app/layout.tsx");
  const layoutStats = printResults("src/app/layout.tsx", layoutResults);
  totalPassed += layoutStats.passed;
  totalChecks += layoutStats.total;

  // Validate sitemap.ts
  const sitemapResults = validateTypeScriptFile("src/app/sitemap.ts");
  const sitemapStats = printResults("src/app/sitemap.ts", sitemapResults);
  totalPassed += sitemapStats.passed;
  totalChecks += sitemapStats.total;

  // Validate robots.ts
  const robotsResults = validateTypeScriptFile("src/app/robots.ts");
  const robotsStats = printResults("src/app/robots.ts", robotsResults);
  totalPassed += robotsStats.passed;
  totalChecks += robotsStats.total;

  // Validate manifest.json
  const manifestResults = validateJSONFile("public/manifest.json");
  const manifestStats = printResults("public/manifest.json", manifestResults);
  totalPassed += manifestStats.passed;
  totalChecks += manifestStats.total;

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📈 SUMMARY");
  console.log("=".repeat(50));
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalChecks - totalPassed}`);
  console.log(
    `Success Rate: ${((totalPassed / totalChecks) * 100).toFixed(1)}%`
  );

  if (totalPassed === totalChecks) {
    console.log("\n🎉 All SEO checks passed! Your website is well-optimized.");
  } else {
    console.log(
      "\n⚠️  Some SEO checks failed. Please review the issues above."
    );
  }

  console.log("\n💡 Next Steps:");
  console.log('1. Replace "your-domain.com" with your actual domain');
  console.log("2. Add actual images for Open Graph and Twitter Cards");
  console.log("3. Set up Google Search Console");
  console.log("4. Monitor performance with Lighthouse");
}

if (require.main === module) {
  main();
}

module.exports = {
  validateHTMLFile,
  validateXMLFile,
  validateJSONFile,
  validateTextFile,
  validateComponent,
};
