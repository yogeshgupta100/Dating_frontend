import { handleResponse } from "../api";
import { defaultHeaders } from "../api";
import { LocationResponse } from "..";
import { url } from "../api";

// Cache for locations
const locationCache = new Map<
  string,
  { data: any; timestamp: number; ttl: number }
>();
const LOCATION_CACHE_TTL = 1 * 60 * 1000; // 1 minute

// Helper functions for caching
const isLocationCacheValid = (key: string): boolean => {
  const cached = locationCache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < cached.ttl;
};

const getCachedLocation = (key: string): any => {
  const cached = locationCache.get(key);
  return cached ? cached.data : null;
};

const setCachedLocation = (key: string, data: any): void => {
  locationCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: LOCATION_CACHE_TTL,
  });
};

// Function to clear cache for a specific location or all locations
export const clearLocationCache = (slug?: string): void => {
  if (slug) {
    locationCache.delete(`location-slug-${slug}`);
    console.log(`Cleared cache for location: ${slug}`);
  } else {
    locationCache.clear();
    console.log("Cleared all location cache");
  }
};

// Enhanced fetch with timeout - reduced to 3 seconds for faster response
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout (reduced from 5 seconds)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const getLocations = async (): Promise<LocationResponse[]> => {
  const cacheKey = "all-locations";

  // Check cache first (skip during build to prevent caching large responses)
  const isBuildTime = process.env.NODE_ENV === "production" && typeof window === "undefined";
  
  if (!isBuildTime && isLocationCacheValid(cacheKey)) {
    console.log("Returning cached locations");
    return getCachedLocation(cacheKey);
  }

  try {
    console.log("Fetching from URL:", `${url}/states`);
    const response = await fetchWithTimeout(`${url}/states`, {
      method: "GET",
      headers: defaultHeaders,
      // Disable caching during build to prevent Next.js from trying to cache large responses
      cache: isBuildTime ? "no-store" : undefined,
      next: isBuildTime ? { revalidate: 0 } : undefined,
    } as RequestInit);

    const data = await handleResponse(response);
    setCachedLocation(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error in getLocations:", error);

    // Return cached data if available, even if expired
    const cached = getCachedLocation(cacheKey);
    if (cached) {
      console.log("Returning expired cached locations due to error");
      return cached;
    }

    throw error;
  }
};

export const getLocationBySlug = async (
  slug: string,
  forceRefresh: boolean = false
): Promise<LocationResponse | null> => {
  const cacheKey = `location-slug-${slug}`;

  console.log("getLocationBySlug: Starting fetch for slug:", slug);

  // Check cache first (unless force refresh is requested)
  if (!forceRefresh && isLocationCacheValid(cacheKey)) {
    console.log("getLocationBySlug: Returning cached data for slug:", slug);
    return getCachedLocation(cacheKey);
  }

  try {
    const apiUrl = `${url}/states/slug/${slug}`;
    console.log("getLocationBySlug: Making API call to:", apiUrl);
    
    const response = await fetchWithTimeout(apiUrl, {
      method: "GET",
      headers: defaultHeaders,
    });

    console.log("getLocationBySlug: Response status:", response.status, response.statusText);
    
    if (response.status === 404) {
      console.log("getLocationBySlug: Location not found (404) for slug:", slug);
      setCachedLocation(cacheKey, null);
      return null;
    }

    if (!response.ok) {
      console.error(`getLocationBySlug: API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }

    console.log("getLocationBySlug: Response is OK, parsing data...");
    const data = await handleResponse(response);

    console.log("getLocationBySlug: Raw response data:", data);
    
    // Validate the response data
    if (!data || typeof data !== "object") {
      console.error("getLocationBySlug: Invalid response data:", data);
      throw new Error("Invalid response data");
    }

    // Debug the location data structure
    console.log("getLocationBySlug: Location API Response Debug:", {
      hasData: !!data,
      dataType: typeof data,
      dataKeys: Object.keys(data),
      phoneNumber: data.phone_number,
      phoneNumberType: typeof data.phone_number,
      phoneNumberLength: data.phone_number?.length,
      name: data.name,
      id: data.id,
    });

    console.log("getLocationBySlug: Caching and returning data for slug:", slug);
    setCachedLocation(cacheKey, data);
    return data;
  } catch (error) {
    console.error("getLocationBySlug: Error fetching location by slug:", slug, error);

    // Return cached data if available
    const cached = getCachedLocation(cacheKey);
    if (cached !== undefined) {
      console.log("getLocationBySlug: Returning cached data due to error for slug:", slug);
      return cached;
    }

    console.log("getLocationBySlug: No cached data available, returning null for slug:", slug);
    // Don't throw the error, return null instead
    return null;
  }
};

export const createLocation = async (
  name: string,
  heading: string,
  sub_heading: string,
  content: string,
  slug?: string,
  seo_title?: string,
  seo_desc?: string,
  seo_keywords?: string[],
  faq?: string,
  phone_number?: string
): Promise<LocationResponse> => {
  const response = await fetchWithTimeout(`${url}/states`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({
      name,
      phone_number: phone_number || "",
      heading,
      sub_heading,
      content,
      slug,
      seo_title,
      seo_desc,
      seo_keyword: seo_keywords,
      faq,
    }),
  });

  const result = await handleResponse(response);

  // Clear location cache after creation
  locationCache.clear();

  return result;
};

export const getLocationById = async (
  id: string
): Promise<LocationResponse> => {
  const cacheKey = `location-id-${id}`;

  // Check cache first
  if (isLocationCacheValid(cacheKey)) {
    return getCachedLocation(cacheKey);
  }

  try {
    const response = await fetchWithTimeout(`${url}/states/${id}`, {
      method: "GET",
      headers: defaultHeaders,
      mode: "cors",
    });

    const data = await handleResponse(response);
    setCachedLocation(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error in getLocationById:", error);

    // Return cached data if available
    const cached = getCachedLocation(cacheKey);
    if (cached) {
      return cached;
    }

    throw error;
  }
};

export const updateLocation = async (
  id: string,
  name: string,
  heading: string,
  sub_heading: string,
  content: string,
  slug?: string,
  seo_title?: string,
  seo_desc?: string,
  seo_keywords?: string[],
  faq?: string,
  phone_number?: string
): Promise<LocationResponse> => {
  const response = await fetchWithTimeout(`${url}/states/${id}`, {
    method: "PUT",
    headers: defaultHeaders,
    body: JSON.stringify({
      name,
      phone_number: phone_number || "",
      heading,
      sub_heading,
      content,
      slug,
      seo_title,
      seo_desc,
      seo_keyword: seo_keywords,
      faq,
    }),
  });

  const result = await handleResponse(response);

  // Clear location cache after update
  locationCache.clear();

  return result;
};

export const deleteLocation = async (id: string): Promise<void> => {
  const response = await fetchWithTimeout(`${url}/states/${id}`, {
    method: "DELETE",
    headers: defaultHeaders,
  });

  await handleResponse(response);

  // Clear location cache after deletion
  locationCache.clear();
};

// Get location cache stats
export const getLocationCacheStats = (): { size: number; keys: string[] } => {
  return {
    size: locationCache.size,
    keys: Array.from(locationCache.keys()),
  };
};
