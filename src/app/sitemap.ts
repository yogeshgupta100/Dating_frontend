import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pokkoo.in";
  const currentDate = new Date().toISOString();

  console.log("🔍 Generating dynamic sitemap for production...");

  // Start with static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  let locationPages: MetadataRoute.Sitemap = [];
  let modelPages: MetadataRoute.Sitemap = [];

  try {
    console.log("📡 Fetching ALL locations from API...");

    // Direct API call to ensure we get all locations
    const apiUrl = "https://api.pokkoo.in/states";
    console.log("🌐 API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      // Add timeout
      signal: AbortSignal.timeout(45000), // 45 seconds
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const locations = await response.json();
    console.log(
      `✅ Successfully fetched ${locations?.length || 0} locations from API`
    );

    if (locations && Array.isArray(locations) && locations.length > 0) {
      console.log("📍 Processing all locations for sitemap...");

      // Process ALL locations
      locationPages = locations.map((location) => {
        const locationUrl = `${baseUrl}/${location.slug || location.id}`;
        return {
          url: locationUrl,
          lastModified: currentDate,
          changeFrequency: "daily" as const,
          priority: 0.8,
        };
      });

      console.log(`✅ Added ${locationPages.length} location pages to sitemap`);

      // Fetch models for first 10 locations to avoid huge sitemaps
      console.log("👥 Fetching models for first 10 locations...");
      const locationsToProcess = locations.slice(0, 10);

      for (const location of locationsToProcess) {
        try {
          console.log(`🔍 Fetching models for: ${location.name}`);

          const modelsResponse = await fetch(
            `https://api.pokkoo.in/models/${location.id}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
              signal: AbortSignal.timeout(15000), // 15 seconds
            }
          );

          if (modelsResponse.ok) {
            const models = await modelsResponse.json();
            console.log(
              `✅ Found ${models?.length || 0} models for ${location.name}`
            );

            if (models && Array.isArray(models) && models.length > 0) {
              // Limit to 5 models per location
              const limitedModels = models.slice(0, 5);
              const locationModelPages: MetadataRoute.Sitemap =
                limitedModels.map((model) => {
                  const modelUrl = `${baseUrl}/${
                    location.slug || location.id
                  }/${model.slug || model.id}`;
                  return {
                    url: modelUrl,
                    lastModified: currentDate,
                    changeFrequency: "weekly" as const,
                    priority: 0.6,
                  };
                });
              modelPages.push(...locationModelPages);
            }
          }
        } catch (error) {
          console.error(
            `❌ Error fetching models for ${location.name}:`,
            error
          );
          // Continue with other locations
        }
      }
    } else {
      console.log("⚠️ No locations found from API, using fallback data");
      throw new Error("No locations returned from API");
    }
  } catch (error) {
    console.error("❌ Error generating dynamic sitemap:", error);

    // Fallback: Add comprehensive location data if API fails
    console.log("🔄 Using comprehensive fallback locations...");
    const fallbackLocations = [
      { name: "Delhi", slug: "delhi" },
      { name: "Mumbai", slug: "mumbai" },
      { name: "Bangalore", slug: "bangalore" },
      { name: "Hyderabad", slug: "hyderabad" },
      { name: "Chennai", slug: "chennai" },
      { name: "Kolkata", slug: "kolkata" },
      { name: "Pune", slug: "pune" },
      { name: "Ahmedabad", slug: "ahmedabad" },
      { name: "Surat", slug: "surat" },
      { name: "Lucknow", slug: "lucknow" },
      { name: "Kanpur", slug: "kanpur" },
      { name: "Nagpur", slug: "nagpur" },
      { name: "Indore", slug: "indore" },
      { name: "Thane", slug: "thane" },
      { name: "Bhopal", slug: "bhopal" },
      { name: "Visakhapatnam", slug: "visakhapatnam" },
      { name: "Patna", slug: "patna" },
      { name: "Vadodara", slug: "vadodara" },
      { name: "Ghaziabad", slug: "ghaziabad" },
      { name: "Chas", slug: "chas-call-girl" },
      { name: "Gwalior", slug: "call-girl-gwalior" },
      { name: "Shivamogga", slug: "call-girl-shivamogga" },
      { name: "Pokkoo", slug: "Pokkoo" },
    ];

    locationPages = fallbackLocations.map((location) => ({
      url: `${baseUrl}/${location.slug}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    // Add sample model pages for each location
    fallbackLocations.forEach((location) => {
      for (let i = 1; i <= 5; i++) {
        modelPages.push({
          url: `${baseUrl}/${location.slug}/profile-${i}`,
          lastModified: currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        });
      }
    });
  }

  const allPages = [...staticPages, ...locationPages, ...modelPages];
  console.log(`🎉 Sitemap generated with ${allPages.length} total URLs:`);
  console.log(`   - ${staticPages.length} static pages`);
  console.log(`   - ${locationPages.length} location pages`);
  console.log(`   - ${modelPages.length} model pages`);

  return allPages;
}
