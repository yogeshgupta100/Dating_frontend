import { handleResponse } from "../api";

import { defaultHeaders } from "../api";

import { LocationResponse } from "..";
import { url } from "../api";

export const getLocations = async (): Promise<LocationResponse[]> => {
  try {
    console.log("Fetching from URL:", `${url}/states`);
    const response = await fetch(`${url}/states`, {
      method: "GET",
      headers: defaultHeaders,
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error in getLocations:", error);
    throw error;
  }
};

export const getLocationBySlug = async (slug: string): Promise<LocationResponse | null> => {
  try {
    const response = await fetch(`${url}/states/slug/${slug}`, {
      method: "GET",
      headers: defaultHeaders,
    });
    
    if (response.status === 404) {
      return null;
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error in getLocationBySlug:", error);
    return null;
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
  const response = await fetch(`${url}/states`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ name, phone_number, heading, sub_heading, content, slug , seo_title, seo_desc, seo_keyword: seo_keywords ,faq}),
  });
  return handleResponse(response);
};

export const getLocationById = async (
  id: string
): Promise<LocationResponse> => {
  const response = await fetch(`${url}/states/${id}`, {
    method: "GET",
    headers: defaultHeaders,
    mode: "cors",
    //   credentials: 'include',
  });
  return handleResponse(response);
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
  const response = await fetch(`${url}/states/${id}`, {
    method: "PUT",
    headers: defaultHeaders,
    body: JSON.stringify({ name, phone_number, heading, sub_heading, content, slug , seo_title, seo_desc, seo_keyword: seo_keywords, faq}),
  });
  return handleResponse(response);
};

export const deleteLocation = async (id: string): Promise<void> => {
  const response = await fetch(`${url}/states/${id}`, {
    method: "DELETE",
    headers: defaultHeaders,
  });
  return handleResponse(response);
};
