// Cloudinary configuration for browser environment
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

// Validate environment variables
if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing Cloudinary environment variables. Please check your .env file.');
  console.error('Required variables: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, NEXT_PUBLIC_CLOUDINARY_API_SECRET');
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any[];
  public_id?: string;
}

// Upload image to Cloudinary using direct upload
export const uploadImageToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    // Validate environment variables
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials not configured. Please check your .env file.');
    }

    // Create upload preset if not exists (you can create this in Cloudinary dashboard)
    const uploadPreset = 'dating-app-uploads'; // You'll need to create this in Cloudinary
    
    // Use Cloudinary's direct upload endpoint
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', cloudName);
    
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result = await response.json();
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Delete image from Cloudinary (this will need to be done server-side for security)
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Note: For security reasons, image deletion should be done server-side
    // This is a placeholder - you'll need to implement this on your backend
    console.warn('Image deletion should be implemented server-side for security');
    throw new Error('Image deletion not implemented - use server-side deletion');
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Get optimized image URL with transformations
export const getOptimizedImageUrl = (
  publicId: string,
  transformations: Record<string, any>[] = []
): string => {
  const defaultTransformations = [
    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
    { quality: 'auto', fetch_format: 'auto' }
  ];
  
  const allTransformations = [...defaultTransformations, ...transformations];
  
  // Build transformation string manually
  const transformationString = allTransformations.map(t => {
    const parts: string[] = [];
    if (t.width) parts.push(`w_${t.width}`);
    if (t.height) parts.push(`h_${t.height}`);
    if (t.crop) parts.push(`c_${t.crop}`);
    if (t.gravity) parts.push(`g_${t.gravity}`);
    if (t.quality) parts.push(`q_${t.quality}`);
    if (t.fetch_format) parts.push(`f_${t.fetch_format}`);
    return parts.join(',');
  }).join('/');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
};

// Extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
      return publicIdWithExtension.split('.')[0]; // Remove file extension
    }
    return null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}; 