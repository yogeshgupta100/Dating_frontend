import { LocationResponse, Model, Faq } from ".";
import { toast } from "react-toastify";

export const url =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.pokkoo.in";

// Cache for storing API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Request timeout in milliseconds (3 seconds)
const REQUEST_TIMEOUT = 3000;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Helper function to check if cache is valid
const isCacheValid = (key: string): boolean => {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < cached.ttl;
};

// Helper function to get cached data
const getCachedData = (key: string): any => {
  const cached = cache.get(key);
  return cached ? cached.data : null;
};

// Helper function to set cached data
const setCachedData = (
  key: string,
  data: any,
  ttl: number = CACHE_TTL
): void => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

// Helper function to create timeout promise
const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), timeout);
  });
};

// Helper function to delay execution
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Enhanced fetch with timeout and retry logic
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  retries: number = MAX_RETRIES
): Promise<Response> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await Promise.race([
      fetch(url, { ...options, signal: controller.signal }),
      createTimeoutPromise(REQUEST_TIMEOUT),
    ]);

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (
      retries > 0 &&
      ((error instanceof Error && error.name === "AbortError") ||
        (error instanceof Error && error.message.includes("timeout")))
    ) {
      console.warn(`Request failed, retrying... (${retries} attempts left)`);
      await delay(RETRY_DELAY);
      return fetchWithTimeout(url, options, retries - 1);
    }
    throw error;
  }
};

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Default headers for all requests
export const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "ngrok-skip-browser-warning": "true",
};

// API service with caching and optimization
export const api = {
  // Locations

  // FAQs
  getFaqs: async (): Promise<Faq[]> => {
    const cacheKey = "faqs";

    // Check cache first
    if (isCacheValid(cacheKey)) {
      return getCachedData(cacheKey);
    }

    try {
      const response = await fetchWithTimeout(`${url}/faq`, {
        method: "GET",
        headers: defaultHeaders,
      });

      const data = await handleResponse(response);

      // Handle case where API returns a single object instead of array
      let result: Faq[];
      if (Array.isArray(data)) {
        result = data;
      } else if (data && typeof data === "object" && data.id) {
        result = [data];
      } else {
        result = [];
      }

      // Cache the result
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      // Return cached data if available, even if expired
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log("Returning cached FAQ data due to error");
        return cached;
      }
      throw error;
    }
  },

  createFaq: async (faq: Omit<Faq, "id">): Promise<Faq> => {
    const response = await fetchWithTimeout(`${url}/faq`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(faq),
    });

    const result = await handleResponse(response);

    // Invalidate FAQ cache
    cache.delete("faqs");

    return result;
  },

  updateFaq: async (id: string, faq: Omit<Faq, "id">): Promise<Faq> => {
    const response = await fetchWithTimeout(`${url}/api/faqs/${id}`, {
      method: "PUT",
      headers: defaultHeaders,
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(faq),
    });

    const result = await handleResponse(response);

    // Invalidate FAQ cache
    cache.delete("faqs");

    return result;
  },

  deleteFaq: async (id: string): Promise<void> => {
    const response = await fetchWithTimeout(`${url}/api/faqs/${id}`, {
      method: "DELETE",
      headers: defaultHeaders,
      mode: "cors",
      credentials: "include",
    });

    await handleResponse(response);

    // Invalidate FAQ cache
    cache.delete("faqs");
  },

  createPhoneNumber: async (phoneNumber: string): Promise<void> => {
    const response = await fetchWithTimeout(`${url}/global-phone`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    await handleResponse(response);

    // Invalidate phone cache
    cache.delete("phone");
  },

  getPhoneNumber: async (): Promise<string> => {
    const cacheKey = "phone";

    // Check cache first
    if (isCacheValid(cacheKey)) {
      return getCachedData(cacheKey);
    }

    try {
      const response = await fetchWithTimeout(`${url}/global-phone`, {
        method: "GET",
        headers: defaultHeaders,
      });

      const result = await handleResponse(response);

      // Cache the result with longer TTL (30 minutes for phone number)
      setCachedData(cacheKey, result, 30 * 60 * 1000);

      return result;
    } catch (error) {
      console.error("Error fetching phone number:", error);
      // Return cached data if available, even if expired
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log("Returning cached phone data due to error");
        return cached;
      }
      throw error;
    }
  },

  // Clear all cache
  clearCache: (): void => {
    cache.clear();
  },

  // Get cache statistics
  getCacheStats: (): { size: number; keys: string[] } => {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
    };
  },
};
