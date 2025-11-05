import { getOptimizedImageUrl } from "../services/cloudinary";

// Ensure Cloudinary URLs use HTTPS to prevent mixed content warnings
export const ensureHttpsUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== "string") {
    return url || "";
  }

  // Replace http:// with https:// for Cloudinary URLs
  if (url.includes("cloudinary.com") && url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  return url;
};

// Get optimized image URL for different use cases
export const getProfileImageUrl = (
  imageUrl: string,
  size: "small" | "medium" | "large" = "medium"
) => {
  // Ensure HTTPS first
  const secureUrl = ensureHttpsUrl(imageUrl);

  if (!secureUrl || !secureUrl.includes("cloudinary")) {
    return secureUrl; // Return original URL if not a Cloudinary URL
  }

  const sizes = {
    small: { width: 100, height: 100, crop: "fill", gravity: "face" },
    medium: { width: 400, height: 400, crop: "fill", gravity: "face" },
    large: { width: 800, height: 800, crop: "limit" },
  };

  // Extract public_id from URL
  const urlParts = secureUrl.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExtension.split(".")[0];

    return getOptimizedImageUrl(publicId, [sizes[size]]);
  }

  return secureUrl;
};

export const getBannerImageUrl = (
  imageUrl: string,
  width: number = 1200,
  height: number = 400
) => {
  // Ensure HTTPS first
  const secureUrl = ensureHttpsUrl(imageUrl);

  if (!secureUrl || !secureUrl.includes("cloudinary")) {
    return secureUrl;
  }

  // Extract public_id from URL
  const urlParts = secureUrl.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExtension.split(".")[0];

    return getOptimizedImageUrl(publicId, [
      { width, height, crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "auto" },
    ]);
  }

  return secureUrl;
};

// Check if URL is a Cloudinary URL
export const isCloudinaryUrl = (url: string): boolean => {
  return typeof url === "string" && url.includes("cloudinary.com");
};

// Get image dimensions from Cloudinary URL
export const getImageDimensions = (
  imageUrl: string
): { width: number; height: number } | null => {
  if (!isCloudinaryUrl(imageUrl)) {
    return null;
  }

  // Cloudinary URLs can include transformation parameters
  const urlParts = imageUrl.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");

  if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
    const transformations = urlParts[uploadIndex + 1];
    // Parse transformations to get dimensions
    // This is a simplified version - you might need more complex parsing
    const widthMatch = transformations.match(/w_(\d+)/);
    const heightMatch = transformations.match(/h_(\d+)/);

    if (widthMatch && heightMatch) {
      return {
        width: parseInt(widthMatch[1]),
        height: parseInt(heightMatch[1]),
      };
    }
  }

  return null;
};
