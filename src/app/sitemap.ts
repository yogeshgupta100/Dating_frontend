import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pokkoo.co.in";
  const currentDate = new Date().toISOString();

  // Production sitemap generation

  // Start with static pages - excluding admin routes
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  let locationPages: MetadataRoute.Sitemap = [];
  let modelPages: MetadataRoute.Sitemap = [];

  try {
    // Direct API call to ensure we get all locations
    const apiUrl = "https://api.pokkoo.in/states/";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Pokkoo-Sitemap-Generator/1.0",
      },
      // Add timeout for large datasets
      signal: AbortSignal.timeout(120000), // 2 minutes for very large datasets
      // Add cache control for better performance
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(
        `API responded with status: ${response.status} - ${response.statusText}`
      );
    }

    const locations = await response.json();

    // Validate response structure
    if (!Array.isArray(locations)) {
      throw new Error("API response is not an array");
    }

    if (locations && Array.isArray(locations) && locations.length > 0) {
      // Process ALL locations from database - no limits
      locationPages = locations.map((location) => {
        const locationUrl = `${baseUrl}/${location.slug || location.id}/`;
        return {
          url: locationUrl,
          lastModified: currentDate,
          changeFrequency: "daily" as const,
          priority: 0.8,
        };
      });

      // Fetch models for first 50 locations to get good coverage without overwhelming the sitemap
      const locationsToProcess = locations.slice(0, 50);

      // Process models in batches to avoid timeout
      const batchSize = 10;
      let totalModelsProcessed = 0;

      for (let i = 0; i < locationsToProcess.length; i += batchSize) {
        const batch = locationsToProcess.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (location) => {
            try {
              const modelsResponse = await fetch(
                `https://api.pokkoo.in/models/${location.id}`,
                {
                  method: "GET",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": "Pokkoo-Sitemap-Generator/1.0",
                  },
                  signal: AbortSignal.timeout(15000), // 15 seconds
                  cache: "no-store", // Ensure fresh data
                }
              );

              if (modelsResponse.ok) {
                const models = await modelsResponse.json();

                if (models && Array.isArray(models) && models.length > 0) {
                  // Limit to 15 models per location for better coverage
                  const limitedModels = models.slice(0, 15);
                  const locationModelPages: MetadataRoute.Sitemap =
                    limitedModels.map((model) => {
                      const modelUrl = `${baseUrl}/${
                        location.slug || location.id
                      }/${model.slug || model.id}/`;
                      return {
                        url: modelUrl,
                        lastModified: currentDate,
                        changeFrequency: "weekly" as const,
                        priority: 0.6,
                      };
                    });
                  modelPages.push(...locationModelPages);
                  totalModelsProcessed += limitedModels.length;
                }
              }
            } catch (error) {
              // Continue with other locations
            }
          })
        );

        // Add small delay between batches to avoid overwhelming the API
        if (i + batchSize < locationsToProcess.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } else {
      throw new Error("No locations returned from API");
    }
  } catch (error) {
    // Fallback: Add comprehensive location data if API fails
    const fallbackLocations = [
      // Major Cities
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

      // Tier 2 Cities
      { name: "Gurgaon", slug: "call-girl-gurgaon" },
      { name: "Noida", slug: "call-girl-noida" },
      { name: "Faridabad", slug: "call-girl-faridabad" },
      { name: "Chandigarh", slug: "call-girl-chandigarh" },
      { name: "Jaipur", slug: "call-girl-jaipur" },
      { name: "Jodhpur", slug: "call-girl-jodhpur" },
      { name: "Udaipur", slug: "call-girl-udaipur" },
      { name: "Kochi", slug: "call-girl-kochi" },
      { name: "Thiruvananthapuram", slug: "call-girl-thiruvananthapuram" },
      { name: "Coimbatore", slug: "call-girl-coimbatore" },
      { name: "Madurai", slug: "call-girl-madurai" },
      { name: "Tiruchirappalli", slug: "call-girl-tiruchirappalli" },
      { name: "Salem", slug: "call-girl-salem" },
      { name: "Tirunelveli", slug: "call-girl-tirunelveli" },
      { name: "Erode", slug: "call-girl-erode" },
      { name: "Vellore", slug: "call-girl-vellore" },
      { name: "Tiruppur", slug: "call-girl-tiruppur" },
      { name: "Dindigul", slug: "call-girl-dindigul" },
      { name: "Thanjavur", slug: "call-girl-thanjavur" },
      { name: "Ranchi", slug: "call-girl-ranchi" },
      { name: "Jamshedpur", slug: "call-girl-jamshedpur" },
      { name: "Dhanbad", slug: "call-girl-dhanbad" },
      { name: "Bokaro", slug: "call-girl-bokaro" },
      { name: "Deoghar", slug: "call-girl-deoghar" },
      { name: "Phusro", slug: "call-girl-phusro" },
      { name: "Hazaribagh", slug: "call-girl-hazaribagh" },
      { name: "Giridih", slug: "call-girl-giridih" },
      { name: "Ramgarh", slug: "call-girl-ramgarh" },
      { name: "Medininagar", slug: "call-girl-medininagar" },
      { name: "Chas", slug: "chas-call-girl" },
      { name: "Gwalior", slug: "call-girl-gwalior" },
      { name: "Shivamogga", slug: "call-girl-shivamogga" },
      { name: "Pokkoo", slug: "Pokkoo" },

      // Additional Popular Locations
      { name: "Goa", slug: "call-girl-goa" },
      { name: "Kerala", slug: "call-girl-kerala" },
      { name: "Karnataka", slug: "call-girl-karnataka" },
      { name: "Tamil Nadu", slug: "call-girl-tamil-nadu" },
      { name: "Maharashtra", slug: "call-girl-maharashtra" },
      { name: "Gujarat", slug: "call-girl-gujarat" },
      { name: "Rajasthan", slug: "call-girl-rajasthan" },
      { name: "Uttar Pradesh", slug: "call-girl-uttar-pradesh" },
      { name: "Madhya Pradesh", slug: "call-girl-madhya-pradesh" },
      { name: "West Bengal", slug: "call-girl-west-bengal" },
      { name: "Bihar", slug: "call-girl-bihar" },
      { name: "Jharkhand", slug: "call-girl-jharkhand" },
      { name: "Odisha", slug: "call-girl-odisha" },
      { name: "Chhattisgarh", slug: "call-girl-chhattisgarh" },
      { name: "Andhra Pradesh", slug: "call-girl-andhra-pradesh" },
      { name: "Telangana", slug: "call-girl-telangana" },
      { name: "Haryana", slug: "call-girl-haryana" },
      { name: "Punjab", slug: "call-girl-punjab" },
      { name: "Himachal Pradesh", slug: "call-girl-himachal-pradesh" },
      { name: "Uttarakhand", slug: "call-girl-uttarakhand" },
      { name: "Jammu and Kashmir", slug: "call-girl-jammu-kashmir" },
      { name: "Ladakh", slug: "call-girl-ladakh" },
      { name: "Assam", slug: "call-girl-assam" },
      { name: "Manipur", slug: "call-girl-manipur" },
      { name: "Meghalaya", slug: "call-girl-meghalaya" },
      { name: "Mizoram", slug: "call-girl-mizoram" },
      { name: "Nagaland", slug: "call-girl-nagaland" },
      { name: "Tripura", slug: "call-girl-tripura" },
      { name: "Arunachal Pradesh", slug: "call-girl-arunachal-pradesh" },
      { name: "Sikkim", slug: "call-girl-sikkim" },
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

  return allPages;
}
