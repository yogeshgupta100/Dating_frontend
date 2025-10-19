#!/usr/bin/env node

/**
 * Test Production Sitemap
 *
 * This script tests the production sitemap to ensure it contains dynamic content
 * and is not just showing static pages.
 * Run with: node scripts/test-production-sitemap.js
 */

const https = require("https");

console.log("🔍 Testing Production Sitemap...\n");

// Test 1: Check API directly
console.log("1️⃣ Testing API directly...");
https
  .get("https://api.pokkoo.in/states", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const locations = JSON.parse(data);
        console.log(`✅ API returns ${locations.length} locations`);

        // Test 2: Check production sitemap
        console.log("\n2️⃣ Testing production sitemap...");
        https
          .get("https://hi.pokkoo.in/sitemap.xml", (sitemapRes) => {
            let sitemapData = "";
            sitemapRes.on("data", (chunk) => (sitemapData += chunk));
            sitemapRes.on("end", () => {
              const locationUrls =
                sitemapData.match(/<loc>https:\/\/pokkoo\.in\/[^<]+<\/loc>/g) ||
                [];
              const staticUrls =
                sitemapData.match(
                  /<loc>https:\/\/pokkoo\.in\/(about|contact|terms|privacy)<\/loc>/g
                ) || [];
              const modelUrls =
                sitemapData.match(
                  /<loc>https:\/\/pokkoo\.in\/[^\/]+\/[^<]+<\/loc>/g
                ) || [];

              console.log(`📊 Sitemap Analysis:`);
              console.log(
                `   - Total URLs: ${
                  locationUrls.length + staticUrls.length + modelUrls.length
                }`
              );
              console.log(`   - Static pages: ${staticUrls.length}`);
              console.log(
                `   - Location pages: ${
                  locationUrls.length - staticUrls.length
                }`
              );
              console.log(`   - Model pages: ${modelUrls.length}`);

              if (locationUrls.length - staticUrls.length >= 150) {
                console.log("\n🎉 SUCCESS: Sitemap contains all locations!");
                console.log("✅ Production sitemap is working correctly");
              } else {
                console.log("\n❌ ISSUE: Sitemap missing locations");
                console.log(
                  `❌ Expected: 150+ locations, Got: ${
                    locationUrls.length - staticUrls.length
                  }`
                );
                console.log("🔧 Please check deployment and server logs");
              }

              // Show first few location URLs
              console.log("\n📍 Sample location URLs:");
              locationUrls.slice(0, 5).forEach((url) => {
                console.log(`   ${url.replace(/<\/?loc>/g, "")}`);
              });

              if (locationUrls.length > 5) {
                console.log(`   ... and ${locationUrls.length - 5} more`);
              }
            });
          })
          .on("error", (err) => {
            console.error("❌ Error fetching sitemap:", err.message);
          });
      } catch (err) {
        console.error("❌ Error parsing API response:", err.message);
      }
    });
  })
  .on("error", (err) => {
    console.error("❌ Error fetching API:", err.message);
  });
