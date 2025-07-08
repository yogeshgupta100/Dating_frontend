import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pokkoo.in";
  const currentDate = new Date().toISOString();

  console.log("🔍 Generating dynamic sitemap...");

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
    console.log("📡 Fetching locations from API...");

    // Import dynamically to avoid SSR issues
    const { getLocations } = await import("../services/Locations");
    const { getModels } = await import("../services/models");

    // Fetch all locations from API with timeout
    const locationsPromise = getLocations();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API timeout")), 10000)
    );

    const locations = (await Promise.race([
      locationsPromise,
      timeoutPromise,
    ])) as any[];

    console.log(`✅ Found ${locations?.length || 0} locations from API`);

    if (locations && locations.length > 0) {
      locationPages = locations.map((location) => {
        const locationUrl = `${baseUrl}/${location.slug || location.id}`;
        console.log(`📍 Adding location: ${locationUrl}`);
        return {
          url: locationUrl,
          lastModified: currentDate,
          changeFrequency: "daily" as const,
          priority: 0.8,
        };
      });

      // Fetch models for each location (limit to first 5 locations to avoid timeouts)
      console.log("👥 Fetching models for each location...");
      const locationsToProcess = locations.slice(0, 5);

      for (const location of locationsToProcess) {
        try {
          console.log(
            `🔍 Fetching models for location: ${location.name} (ID: ${location.id})`
          );

          const modelsPromise = getModels(location.id.toString());
          const modelTimeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Model API timeout")), 5000)
          );

          const models = (await Promise.race([
            modelsPromise,
            modelTimeoutPromise,
          ])) as any[];
          console.log(
            `✅ Found ${models?.length || 0} models for ${location.name}`
          );

          if (models && models.length > 0) {
            // Limit models per location to avoid huge sitemaps
            const limitedModels = models.slice(0, 20);
            const locationModelPages: MetadataRoute.Sitemap = limitedModels.map(
              (model) => {
                const modelUrl = `${baseUrl}/${location.slug || location.id}/${
                  model.slug || model.id
                }`;
                console.log(`👤 Adding model: ${modelUrl}`);
                return {
                  url: modelUrl,
                  lastModified: currentDate,
                  changeFrequency: "weekly" as const,
                  priority: 0.6,
                };
              }
            );
            modelPages.push(...locationModelPages);
          }
        } catch (error) {
          console.error(
            `❌ Error fetching models for location ${location.name}:`,
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
      for (let i = 1; i <= 10; i++) {
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
