#!/usr/bin/env node

/**
 * Test Production Sitemap
 *
 * This script tests the production sitemap to ensure it contains dynamic content
 * and is not just showing static pages.
 * Run with: node scripts/test-production-sitemap.js
 */

const https = require("https");

async function testProductionSitemap() {
  console.log("🧪 Testing Production Sitemap...\n");

  try {
    // Test the production sitemap
    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "pokkoo.in",
          path: "/sitemap.xml",
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SitemapTester/1.0)",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve({ status: res.statusCode, data });
          });
        }
      );

      req.on("error", (error) => {
        reject(error);
      });

      req.setTimeout(15000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    });

    console.log("✅ Production Sitemap Response:");
    console.log("   Status:", response.status);
    console.log("   Content Length:", response.data.length, "characters");

    // Parse the XML content
    const xmlContent = response.data;

    // Check for dynamic content indicators
    const hasLocations =
      xmlContent.includes("/delhi") ||
      xmlContent.includes("/mumbai") ||
      xmlContent.includes("/bangalore");
    const hasModels =
      xmlContent.includes("/profile-") || xmlContent.includes("/model-");
    const hasStaticPages =
      xmlContent.includes("/about") && xmlContent.includes("/contact");

    console.log("\n📊 Content Analysis:");
    console.log("   Has Location Pages:", hasLocations ? "✅ YES" : "❌ NO");
    console.log("   Has Model Pages:", hasModels ? "✅ YES" : "❌ NO");
    console.log("   Has Static Pages:", hasStaticPages ? "✅ YES" : "❌ NO");

    // Count URLs
    const urlMatches = xmlContent.match(
      /<loc>https:\/\/pokkoo\.in[^<]+<\/loc>/g
    );
    const totalUrls = urlMatches ? urlMatches.length : 0;

    console.log("   Total URLs:", totalUrls);

    // Show sample URLs
    if (urlMatches) {
      console.log("\n🔗 Sample URLs:");
      urlMatches.slice(0, 10).forEach((url, index) => {
        const cleanUrl = url.replace(/<\/?loc>/g, "");
        console.log(`   ${index + 1}. ${cleanUrl}`);
      });

      if (urlMatches.length > 10) {
        console.log(`   ... and ${urlMatches.length - 10} more URLs`);
      }
    }

    // Determine if sitemap is dynamic or static
    if (hasLocations && hasModels && totalUrls > 20) {
      console.log("\n✅ SUCCESS: Production sitemap is DYNAMIC and contains:");
      console.log("   - Location pages");
      console.log("   - Model pages");
      console.log("   - Multiple URLs");
    } else if (hasStaticPages && totalUrls <= 10) {
      console.log(
        "\n❌ ISSUE: Production sitemap appears to be STATIC with only:"
      );
      console.log("   - Basic static pages");
      console.log("   - No location/model pages");
      console.log("   - Very few URLs");
    } else {
      console.log("\n⚠️  WARNING: Production sitemap has mixed content");
    }
  } catch (error) {
    console.error("❌ Error testing production sitemap:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check if the site is deployed with the latest code");
    console.log("2. Verify the sitemap.ts file is in the correct location");
    console.log("3. Check server logs for sitemap generation errors");
    console.log("4. Ensure API endpoints are accessible from production");
  }
}

async function testLocalSitemap() {
  console.log("\n🧪 Testing Local Sitemap (for comparison)...\n");

  try {
    // Test the local sitemap
    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "localhost",
          port: 3000,
          path: "/sitemap.xml",
          method: "GET",
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve({ status: res.statusCode, data });
          });
        }
      );

      req.on("error", (error) => {
        reject(error);
      });

      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    });

    console.log("✅ Local Sitemap Response:");
    console.log("   Status:", response.status);
    console.log("   Content Length:", response.data.length, "characters");

    const xmlContent = response.data;
    const urlMatches = xmlContent.match(
      /<loc>http:\/\/localhost:3000[^<]+<\/loc>/g
    );
    const totalUrls = urlMatches ? urlMatches.length : 0;

    console.log("   Total URLs:", totalUrls);

    const hasLocations =
      xmlContent.includes("/delhi") || xmlContent.includes("/mumbai");
    const hasModels =
      xmlContent.includes("/profile-") || xmlContent.includes("/model-");

    console.log("   Has Location Pages:", hasLocations ? "✅ YES" : "❌ NO");
    console.log("   Has Model Pages:", hasModels ? "✅ YES" : "❌ NO");
  } catch (error) {
    console.log("⚠️  Local sitemap test skipped (dev server not running)");
  }
}

async function runTests() {
  console.log("🚀 Starting Production Sitemap Tests...\n");

  await testProductionSitemap();
  await testLocalSitemap();

  console.log("\n📋 Test Summary:");
  console.log(
    "1. If production sitemap is static → Check deployment and API access"
  );
  console.log(
    "2. If local sitemap works but production doesn't → Environment issue"
  );
  console.log("3. If both are static → sitemap.ts file issue");
  console.log("\n🔧 Next Steps:");
  console.log("1. Deploy the updated sitemap.ts file");
  console.log("2. Check production server logs");
  console.log("3. Verify API endpoints are accessible from production");
}

runTests().catch(console.error);
