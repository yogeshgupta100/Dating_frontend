#!/usr/bin/env node

/**
 * Test Sitemap Generation
 *
 * This script tests the dynamic sitemap generation to ensure it's working correctly.
 * Run with: node scripts/test-sitemap.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

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

    // Test API directly
    console.log("\n🌐 Testing API directly...");
    const apiTest = await new Promise((resolve, reject) => {
      https
        .get("https://api.pokkoo.in/states", (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const locations = JSON.parse(data);
              resolve(locations.length);
            } catch (err) {
              reject(err);
            }
          });
        })
        .on("error", reject);
    });

    console.log(`✅ API returns ${apiTest} locations`);

    // Test production sitemap
    console.log("\n📊 Testing production sitemap...");
    const sitemapTest = await new Promise((resolve, reject) => {
      https
        .get("https://pokkoo.co.in/sitemap.xml", (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const locationUrls =
                data.match(/<loc>https:\/\/pokkoo\.co\.in\/[^<]+<\/loc>/g) ||
                [];
              const staticUrls =
                data.match(
                  /<loc>https:\/\/pokkoo\.co\.in\/(about|contact|terms|privacy)<\/loc>/g
                ) || [];
              const modelUrls =
                data.match(
                  /<loc>https:\/\/pokkoo\.co\.in\/[^\/]+\/[^<]+<\/loc>/g
                ) || [];

              resolve({
                total:
                  locationUrls.length + staticUrls.length + modelUrls.length,
                static: staticUrls.length,
                locations: locationUrls.length - staticUrls.length,
                models: modelUrls.length,
              });
            } catch (err) {
              reject(err);
            }
          });
        })
        .on("error", reject);
    });

    console.log(`📈 Sitemap Analysis:`);
    console.log(`   - Total URLs: ${sitemapTest.total}`);
    console.log(`   - Static pages: ${sitemapTest.static}`);
    console.log(`   - Location pages: ${sitemapTest.locations}`);
    console.log(`   - Model pages: ${sitemapTest.models}`);

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

    console.log("\n📋 Expected Sitemap Structure:");
    console.log("├── Static Pages (5)");
    console.log(`├── Location Pages (${apiTest} from API)`);
    console.log("└── Model Pages (750+ from API)");

    console.log("\n🌐 URLs to Test:");
    console.log("├── Sitemap: http://localhost:3000/sitemap.xml");
    console.log("└── Robots: http://localhost:3000/robots.txt");

    console.log("\n💡 To test the dynamic sitemap:");
    console.log("1. Start the dev server: npm run dev");
    console.log("2. Open: http://localhost:3000/sitemap.xml");
    console.log("3. Check browser console for debug logs");
    console.log("4. Verify URLs match your actual data structure");

    console.log("\n🎯 Expected Behavior:");
    console.log(`✅ Sitemap should show ${apiTest + 750} URLs`);
    console.log(`✅ Should include all ${apiTest} locations from database`);
    console.log("✅ Should include model/profile pages");
    console.log("✅ Should update automatically when data changes");

    // Performance check
    if (sitemapTest.locations >= apiTest * 0.9) {
      console.log(
        "\n🎉 SUCCESS: Sitemap contains most locations from database!"
      );
    } else {
      console.log(
        `\n⚠️ WARNING: Sitemap missing locations (${sitemapTest.locations}/${apiTest})`
      );
      console.log("🔧 Check deployment and server logs");
    }
  } catch (error) {
    console.error("❌ Error testing sitemap:", error);
  }
}

if (require.main === module) {
  testSitemap();
}

module.exports = { testSitemap };
