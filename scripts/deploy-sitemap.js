#!/usr/bin/env node

/**
 * Deploy Dynamic Sitemap
 *
 * This script helps deploy and test the dynamic sitemap to ensure it includes all states.
 * Run with: node scripts/deploy-sitemap.js
 */

const https = require("https");
const { execSync } = require("child_process");

async function deploySitemap() {
  console.log("🚀 Deploying Dynamic Sitemap...\n");

  try {
    // Step 1: Test current API state
    console.log("1️⃣ Testing API state...");
    const apiState = await new Promise((resolve, reject) => {
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

    console.log(`✅ API has ${apiState} locations`);

    // Step 2: Test current production sitemap
    console.log("\n2️⃣ Testing current production sitemap...");
    const currentSitemap = await new Promise((resolve, reject) => {
      https
        .get("https://pokkoo.in/sitemap.xml", (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const locationUrls =
                data.match(/<loc>https:\/\/pokkoo\.in\/[^<]+<\/loc>/g) || [];
              const staticUrls =
                data.match(
                  /<loc>https:\/\/pokkoo\.in\/(about|contact|terms|privacy)<\/loc>/g
                ) || [];
              const modelUrls =
                data.match(
                  /<loc>https:\/\/pokkoo\.in\/[^\/]+\/[^<]+<\/loc>/g
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

    console.log(
      `📊 Current sitemap has ${currentSitemap.locations} location pages`
    );
    console.log(`📊 Current sitemap has ${currentSitemap.models} model pages`);
    console.log(`📊 Current sitemap has ${currentSitemap.total} total URLs`);

    // Step 3: Check if deployment is needed
    const coverage = (currentSitemap.locations / apiState) * 100;
    console.log(`\n📈 Current coverage: ${coverage.toFixed(1)}%`);

    if (coverage >= 90) {
      console.log("✅ Sitemap already has good coverage!");
      console.log(
        "💡 If you want to force a rebuild, run: npm run build && npm run deploy"
      );
      return;
    }

    // Step 4: Build the project
    console.log("\n3️⃣ Building project...");
    try {
      execSync("npm run build", { stdio: "inherit" });
      console.log("✅ Build completed successfully");
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      return;
    }

    // Step 5: Deploy instructions
    console.log("\n4️⃣ Deployment Instructions:");
    console.log("📋 Choose your deployment method:");
    console.log("");
    console.log("Option A - Vercel:");
    console.log("   vercel --prod");
    console.log("");
    console.log("Option B - Netlify:");
    console.log("   netlify deploy --prod");
    console.log("");
    console.log("Option C - Custom Server:");
    console.log("   npm run build");
    console.log("   # Upload .next folder to your server");
    console.log("");
    console.log("Option D - Manual Upload:");
    console.log("   # Upload the entire project to your hosting provider");
    console.log("");

    // Step 6: Post-deployment testing
    console.log("5️⃣ After deployment, test with:");
    console.log("   npm run test:production-sitemap");
    console.log("   npm run test:sitemap");
    console.log("");

    // Step 7: Expected results
    console.log("6️⃣ Expected Results After Deployment:");
    console.log(`   ✅ Sitemap should have ${apiState} location pages`);
    console.log("   ✅ Sitemap should have 750+ model pages");
    console.log(`   ✅ Total URLs should be ${apiState + 750}`);
    console.log("   ✅ All states from database should be included");
    console.log("");

    // Step 8: Troubleshooting
    console.log("7️⃣ If sitemap still shows few locations:");
    console.log("   🔍 Check production server logs");
    console.log("   🔍 Verify API is accessible from production server");
    console.log("   🔍 Check for CORS issues");
    console.log("   🔍 Clear CDN cache if using one");
    console.log("   🔍 Wait 5-10 minutes for changes to propagate");
    console.log("");

    console.log(
      "🎯 Goal: Dynamic sitemap that automatically includes all states from database!"
    );
    console.log(
      "💡 Every time you add a new state, it will automatically appear in the sitemap."
    );
  } catch (error) {
    console.error("❌ Error during deployment process:", error.message);
  }
}

if (require.main === module) {
  deploySitemap();
}

module.exports = { deploySitemap };
