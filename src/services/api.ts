import { LocationResponse, Model, Faq } from ".";
import { toast } from "react-toastify";
export const url =
  process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
    toast.error(error.message || "Something went wrong");
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

// API service
export const api = {
  // Locations

  // FAQs
  getFaqs: async (): Promise<Faq[]> => {
    const response = await fetch(`${url}/faq`, {
      method: "GET",
      headers: defaultHeaders,
    });
    const data = await handleResponse(response);
    
    // Handle case where API returns a single object instead of array
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && data.id) {
      // If it's a single FAQ object, wrap it in an array
      return [data];
    } else {
      // If it's neither array nor valid object, return empty array
      return [];
    }
  },

  createFaq: async (faq: Omit<Faq, "id">): Promise<Faq> => {
    const response = await fetch(`${url}/faq`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(faq),
    });
    return handleResponse(response);
  },

  updateFaq: async (id: string, faq: Omit<Faq, "id">): Promise<Faq> => {
    const response = await fetch(`${url}/api/faqs/${id}`, {
      method: "PUT",
      headers: defaultHeaders,
      mode: "cors",
      credentials: "include",
      body: JSON.stringify(faq),
    });
    return handleResponse(response);
  },

  deleteFaq: async (id: string): Promise<void> => {
    const response = await fetch(`${url}/api/faqs/${id}`, {
      method: "DELETE",
      headers: defaultHeaders,
      mode: "cors",
      credentials: "include",
    });
    return handleResponse(response);
  },

  createPhoneNumber: async (phoneNumber: string): Promise<void> => {
    const response = await fetch(`${url}/global-phone`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    return handleResponse(response);
  },

  getPhoneNumber: async (): Promise<string> => {
    const response = await fetch(`${url}/global-phone`, {
      method: "GET",
      headers: defaultHeaders,
    });
    return handleResponse(response);
  },
};
