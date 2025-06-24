import { Model } from "../index";
import { url, defaultHeaders, handleResponse } from "../api";
import { uploadImageToCloudinary, deleteImageFromCloudinary, extractPublicIdFromUrl } from "../cloudinary";

export const getModels = async (locationId?: string): Promise<Model[]> => {
  const urlWithParams = locationId
    ? `${url}/states/${locationId}/models`
    : `${url}/models`;
  const response = await fetch(urlWithParams, {
    method: "GET",
    headers: defaultHeaders,
  });
  return handleResponse(response);
};

export const getProfile = async (id: string): Promise<Model> => {
  const response = await fetch(`${url}/models/${id}`, {
    method: "GET",
    headers: defaultHeaders,
  });
  return handleResponse(response);
};

export const getProfileBySlug = async (slug: string): Promise<Model | null> => {
  try {
    const response = await fetch(`${url}/models/slug/${slug}`, {
      method: "GET",
      headers: defaultHeaders,
    });
    
    if (response.status === 404) {
      return null;
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error in getProfileBySlug:", error);
    return null;
  }
};

export const createModel = async (
  model: Omit<Model, "id">
): Promise<Model> => {
  try {
    // Upload images to Cloudinary first
    let profileImgUrl = '';
    let bannerImgUrl = '';

    if (model.profile_img instanceof File && model.profile_img.size > 0) {
      const profileResult = await uploadImageToCloudinary(model.profile_img, {
        folder: 'dating-app/profiles'
      });
      profileImgUrl = profileResult.secure_url;
    }

    if (model.banner_img instanceof File && model.banner_img.size > 0) {
      const bannerResult = await uploadImageToCloudinary(model.banner_img, {
        folder: 'dating-app/banners'
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

    const response = await fetch(`${url}/models`, {
      method: "POST",
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating model:', error);
    throw error;
  }
};

export const updateModel = async (
  id: string,
  model: Omit<Model, "id">
): Promise<Model> => {
  try {
    // Upload new images to Cloudinary if they are File objects
    let profileImgUrl = '';
    let bannerImgUrl = '';

    if (model.profile_img instanceof File && model.profile_img.size > 0) {
      const profileResult = await uploadImageToCloudinary(model.profile_img, {
        folder: 'dating-app/profiles'
      });
      profileImgUrl = profileResult.secure_url;
    }

    if (model.banner_img instanceof File && model.banner_img.size > 0) {
      const bannerResult = await uploadImageToCloudinary(model.banner_img, {
        folder: 'dating-app/banners'
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

    const response = await fetch(`${url}/models/${id}`, {
      method: "PUT",
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating model:', error);
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
    console.error('Error deleting model:', error);
    throw error;
  }
};
