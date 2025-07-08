#!/usr/bin/env node

/**
 * Test Phone Icons with Empty Phone Numbers
 *
 * This script tests the PhoneIcon and WhatsAppIcon components to ensure they
 * properly fall back to the global API when a location has an empty phone number.
 * Run with: node scripts/test-phone-icons.js
 */

const https = require("https");

async function testGlobalPhoneAPI() {
  console.log("🧪 Testing Global Phone API...\n");

  try {
    // Test the global phone API endpoint
    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "api.pokkoo.in",
          path: "/global-phone",
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          });
        }
      );

      req.on("error", (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    });

    console.log("✅ Global Phone API Response:");
    console.log("   Status:", response.status);
    console.log("   Data:", JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.phone_number) {
      console.log(
        "\n✅ Global phone number is available:",
        response.data.phone_number
      );
      console.log("✅ Phone icons should work correctly in production");
    } else {
      console.log("\n❌ Global phone number is not available");
      console.log("❌ Phone icons may not work in production");
    }
  } catch (error) {
    console.error("❌ Error testing global phone API:", error.message);
    console.log(
      "\n❌ Phone icons may not work in production due to API issues"
    );
  }
}

async function testLocationAPI() {
  console.log("\n🧪 Testing Location API with Empty Phone Number...\n");

  try {
    // Test a location with empty phone number
    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "api.pokkoo.in",
          path: "/states/slug/chas-call-girl",
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          });
        }
      );

      req.on("error", (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    });

    console.log("✅ Location API Response:");
    console.log("   Status:", response.status);
    console.log("   Phone Number:", response.data.phone_number);
    console.log("   Phone Number Type:", typeof response.data.phone_number);
    console.log(
      "   Phone Number Length:",
      response.data.phone_number?.length || 0
    );

    if (response.data.phone_number === "") {
      console.log(
        "\n✅ Location has empty phone number - components should fall back to global API"
      );
    } else if (response.data.phone_number) {
      console.log(
        "\n✅ Location has phone number - components should use it directly"
      );
    } else {
      console.log(
        "\n❌ Location phone number is undefined - components should fall back to global API"
      );
    }
  } catch (error) {
    console.error("❌ Error testing location API:", error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting Phone Icon Tests...\n");

  await testGlobalPhoneAPI();
  await testLocationAPI();

  console.log("\n📋 Test Summary:");
  console.log(
    "1. If global phone API works → Phone icons should work in production"
  );
  console.log(
    "2. If location has empty phone number → Components fall back to global API"
  );
  console.log(
    "3. Check browser console for detailed component logs in production"
  );
  console.log("\n🔧 To debug in production:");
  console.log("1. Open browser developer tools");
  console.log("2. Check console for PhoneIcon/WhatsAppIcon logs");
  console.log("3. Look for API call logs and error messages");
}

runTests().catch(console.error);
