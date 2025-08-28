import { Model } from "../index";
import { url, defaultHeaders, handleResponse } from "../api";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
} from "../cloudinary";

// Cache for models
const modelCache = new Map<
  string,
  { data: any; timestamp: number; ttl: number }
>();
const MODEL_CACHE_TTL = 10 * 60 * 1000; // 10 minutes (increased from 5 minutes)

// Helper functions for caching
const isModelCacheValid = (key: string): boolean => {
  const cached = modelCache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < cached.ttl;
};

const getCachedModel = (key: string): any => {
  const cached = modelCache.get(key);
  return cached ? cached.data : null;
};

const setCachedModel = (key: string, data: any): void => {
  modelCache.set(key, { data, timestamp: Date.now(), ttl: MODEL_CACHE_TTL });
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

export const getModels = async (locationId?: string): Promise<Model[]> => {
  const cacheKey = locationId ? `models-location-${locationId}` : "models-all";

  // Check cache first
  if (isModelCacheValid(cacheKey)) {
    console.log("Returning cached models");
    return getCachedModel(cacheKey);
  }

  try {
    const urlWithParams = locationId
      ? `${url}/states/${locationId}/models`
      : `${url}/models`;

    const response = await fetchWithTimeout(urlWithParams, {
      method: "GET",
      headers: defaultHeaders,
    });

    const data = await handleResponse(response);
    setCachedModel(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching models:", error);

    // Return cached data if available, even if expired
    const cached = getCachedModel(cacheKey);
    if (cached) {
      console.log("Returning expired cached models due to error");
      return cached;
    }

    throw error;
  }
};

export const getProfile = async (id: string): Promise<Model> => {
  const cacheKey = `profile-${id}`;

  // Check cache first
  if (isModelCacheValid(cacheKey)) {
    return getCachedModel(cacheKey);
  }

  try {
    const response = await fetchWithTimeout(`${url}/models/${id}`, {
      method: "GET",
      headers: defaultHeaders,
    });

    const data = await handleResponse(response);

    // Handle case where API returns an array instead of single object
    let result: Model;
    if (Array.isArray(data) && data.length > 0) {
      result = data[0]; // Return the first item in the array
    } else if (data && typeof data === "object" && data.id) {
      result = data; // Return the single object
    } else {
      throw new Error("Profile not found");
    }

    setCachedModel(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching profile:", error);

    // Return cached data if available
    const cached = getCachedModel(cacheKey);
    if (cached) {
      return cached;
    }

    throw error;
  }
};

export const getProfileBySlug = async (slug: string): Promise<Model | null> => {
  const cacheKey = `profile-slug-${slug}`;

  // Check cache first
  if (isModelCacheValid(cacheKey)) {
    return getCachedModel(cacheKey);
  }

  try {
    const response = await fetchWithTimeout(`${url}/models/slug/${slug}`, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (response.status === 404) {
      setCachedModel(cacheKey, null);
      return null;
    }

    const data = await handleResponse(response);

    // Handle case where API returns an array instead of single object
    let result: Model | null;
    if (Array.isArray(data) && data.length > 0) {
      result = data[0]; // Return the first item in the array
    } else if (data && typeof data === "object" && data.id) {
      result = data; // Return the single object
    } else {
      result = null;
    }

    setCachedModel(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error in getProfileBySlug:", error);

    // Return cached data if available
    const cached = getCachedModel(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    return null;
  }
};

export const createModel = async (model: Omit<Model, "id">): Promise<Model> => {
  try {
    // Upload images to Cloudinary first
    let profileImgUrl = "";
    let bannerImgUrl = "";

    if (model.profile_img instanceof File && model.profile_img.size > 0) {
      const profileResult = await uploadImageToCloudinary(model.profile_img, {
        folder: "dating-app/profiles",
      });
      profileImgUrl = profileResult.secure_url;
    }

    if (model.banner_img instanceof File && model.banner_img.size > 0) {
      const bannerResult = await uploadImageToCloudinary(model.banner_img, {
        folder: "dating-app/banners",
      });
      bannerImgUrl = bannerResult.secure_url;
    }

    // Prepare data for backend (without File objects)
    const modelData = {
      ...model,
      profile_img: profileImgUrl || model.profile_img,
      banner_img: bannerImgUrl || model.banner_img,
    };

    // Remove File objects and send only URLs to backend
    const formData = new FormData();
    Object.entries(modelData).forEach(([key, value]) => {
      if (key === "services" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (key !== "id") {
        formData.append(key, String(value));
      }
    });

    const response = await fetchWithTimeout(`${url}/models`, {
      method: "POST",
      body: formData,
    });

    const result = await handleResponse(response);

    // Clear model cache after creation
    modelCache.clear();

    return result;
  } catch (error) {
    console.error("Error creating model:", error);
    throw error;
  }
};

export const updateModel = async (
  id: string,
  model: Omit<Model, "id">
): Promise<Model> => {
  try {
    // Upload new images to Cloudinary if they are File objects
    let profileImgUrl = "";
    let bannerImgUrl = "";

    if (model.profile_img instanceof File && model.profile_img.size > 0) {
      const profileResult = await uploadImageToCloudinary(model.profile_img, {
        folder: "dating-app/profiles",
      });
      profileImgUrl = profileResult.secure_url;
    }

    if (model.banner_img instanceof File && model.banner_img.size > 0) {
      const bannerResult = await uploadImageToCloudinary(model.banner_img, {
        folder: "dating-app/banners",
      });
      bannerImgUrl = bannerResult.secure_url;
    }

    // Prepare data for backend
    const modelData = {
      ...model,
      profile_img: profileImgUrl || model.profile_img,
      banner_img: bannerImgUrl || model.banner_img,
    };

    const formData = new FormData();
    Object.entries(modelData).forEach(([key, value]) => {
      if (key === "services" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await fetchWithTimeout(`${url}/models/${id}`, {
      method: "PUT",
      body: formData,
    });

    const result = await handleResponse(response);

    // Clear model cache after update
    modelCache.clear();

    return result;
  } catch (error) {
    console.error("Error updating model:", error);
    throw error;
  }
};

export const deleteModel = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${url}/models/${id}`, {
      method: "DELETE",
      headers: defaultHeaders,
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error deleting model:", error);
    throw error;
  }
};

// Clear model cache
export const clearModelCache = (): void => {
  modelCache.clear();
};

// Get model cache stats
export const getModelCacheStats = (): { size: number; keys: string[] } => {
  return {
    size: modelCache.size,
    keys: Array.from(modelCache.keys()),
  };
};
