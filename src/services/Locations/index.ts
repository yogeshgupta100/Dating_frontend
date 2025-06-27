import { handleResponse } from "../api";
import { defaultHeaders } from "../api";
import { LocationResponse } from "..";
import { url } from "../api";

// Cache for locations
const locationCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const LOCATION_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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
  locationCache.set(key, { data, timestamp: Date.now(), ttl: LOCATION_CACHE_TTL });
};

// Enhanced fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const getLocations = async (): Promise<LocationResponse[]> => {
  const cacheKey = 'all-locations';
  
  // Check cache first
  if (isLocationCacheValid(cacheKey)) {
    console.log("Returning cached locations");
    return getCachedLocation(cacheKey);
  }
  
  try {
    console.log("Fetching from URL:", `${url}/states`);
    const response = await fetchWithTimeout(`${url}/states`, {
      method: "GET",
      headers: defaultHeaders,
    });

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

export const getLocationBySlug = async (slug: string): Promise<LocationResponse | null> => {
  const cacheKey = `location-slug-${slug}`;
  
  // Check cache first
  if (isLocationCacheValid(cacheKey)) {
    return getCachedLocation(cacheKey);
  }
  
  try {
    const response = await fetchWithTimeout(`${url}/states/slug/${slug}`, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (response.status === 404) {
      setCachedLocation(cacheKey, null);
      return null;
    }

    const data = await handleResponse(response);
    setCachedLocation(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error in getLocationBySlug:", error);
    
    // Return cached data if available
    const cached = getCachedLocation(cacheKey);
    if (cached !== undefined) {
      return cached;
    }
    
    throw error;
  }
};

export const createLocation = async (
  name: string,
  phone_number: string,
  heading: string,
  sub_heading: string,
  content: string,
  slug?: string,
  seo_title?: string,
  seo_desc?: string,
  seo_keywords?: string[],
  faq?: string,
): Promise<LocationResponse> => {
  const response = await fetchWithTimeout(`${url}/states`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ name, phone_number, heading, sub_heading, content, slug , seo_title, seo_desc, seo_keyword: seo_keywords ,faq}),
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
  phone_number: string,
  heading: string,
  sub_heading: string,
  content: string,
  slug?: string,
  seo_title?: string,
  seo_desc?: string,
  seo_keywords?: string[],
  faq?: string,
): Promise<LocationResponse> => {
  const response = await fetchWithTimeout(`${url}/states/${id}`, {
    method: "PUT",
    headers: defaultHeaders,
    body: JSON.stringify({ name, phone_number, heading, sub_heading, content, slug , seo_title, seo_desc, seo_keyword: seo_keywords, faq}),
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

// Clear location cache
export const clearLocationCache = (): void => {
  locationCache.clear();
};

// Get location cache stats
export const getLocationCacheStats = (): { size: number; keys: string[] } => {
  return {
    size: locationCache.size,
    keys: Array.from(locationCache.keys())
  };
};
