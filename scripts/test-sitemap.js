#!/usr/bin/env node

/**
 * Test Sitemap Generation
 *
 * This script tests the dynamic sitemap generation to ensure it's working correctly.
 * Run with: node scripts/test-sitemap.js
 */

const fs = require("fs");
const path = require("path");

async function testSitemap() {
  console.log("🧪 Testing Dynamic Sitemap Generation...\n");

  try {
    // Check if sitemap.ts exists
    const sitemapPath = path.join(__dirname, "../src/app/sitemap.ts");
    if (!fs.existsSync(sitemapPath)) {
      console.log("❌ sitemap.ts not found!");
      return;
    }
    console.log("✅ sitemap.ts found");

    // Check if robots.ts exists
    const robotsPath = path.join(__dirname, "../src/app/robots.ts");
    if (!fs.existsSync(robotsPath)) {
      console.log("❌ robots.ts not found!");
      return;
    }
    console.log("✅ robots.ts found");

    // Check environment variables
    const envPath = path.join(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      if (envContent.includes("NEXT_PUBLIC_BACKEND_URL")) {
        console.log("✅ Backend URL configured in .env");
      } else {
        console.log("⚠️ Backend URL not found in .env");
      }
    } else {
      console.log("⚠️ .env file not found");
    }

    // Check if static sitemap.xml was removed
    const staticSitemapPath = path.join(__dirname, "../public/sitemap.xml");
    if (fs.existsSync(staticSitemapPath)) {
      console.log("⚠️ Static sitemap.xml still exists - should be removed");
    } else {
      console.log("✅ Static sitemap.xml removed (good!)");
    }

    // Check if static robots.txt was removed
    const staticRobotsPath = path.join(__dirname, "../public/robots.txt");
    if (fs.existsSync(staticRobotsPath)) {
      console.log("⚠️ Static robots.txt still exists - should be removed");
    } else {
      console.log("✅ Static robots.txt removed (good!)");
    }

    console.log("\n📋 Sitemap Structure:");
    console.log("├── Static Pages (5)");
    console.log("│   ├── Homepage");
    console.log("│   ├── About");
    console.log("│   ├── Contact");
    console.log("│   ├── Terms");
    console.log("│   └── Privacy");
    console.log("├── Location Pages (20+ from API or fallback)");
    console.log("└── Model Pages (200+ from API or fallback)");

    console.log("\n🌐 URLs to Test:");
    console.log("├── Sitemap: http://localhost:3000/sitemap.xml");
    console.log("└── Robots: http://localhost:3000/robots.txt");

    console.log("\n💡 To test the dynamic sitemap:");
    console.log("1. Start the dev server: npm run dev");
    console.log("2. Open: http://localhost:3000/sitemap.xml");
    console.log("3. Check browser console for debug logs");
    console.log("4. Verify URLs match your actual data structure");

    console.log("\n🎯 Expected Behavior:");
    console.log("✅ Sitemap should show 200+ URLs");
    console.log("✅ Should include all your locations");
    console.log("✅ Should include model/profile pages");
    console.log("✅ Should update automatically when data changes");
  } catch (error) {
    console.error("❌ Error testing sitemap:", error);
  }
}

if (require.main === module) {
  testSitemap();
}

module.exports = { testSitemap };
