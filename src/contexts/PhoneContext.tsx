"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

interface PhoneContextType {
  globalPhoneNumber: string;
  isLoading: boolean;
  error: string | null;
}

const PhoneContext = createContext<PhoneContextType>({
  globalPhoneNumber: "",
  isLoading: false,
  error: null,
});

export const usePhone = () => useContext(PhoneContext);

export const PhoneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [globalPhoneNumber, setGlobalPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalPhone = async () => {
      // Don't fetch if we already have a number
      if (globalPhoneNumber) return;

      setIsLoading(true);
      setError(null);

      try {
        // Set a timeout for the API call to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("API timeout")), 5000)
        );

        const apiPromise = api.getPhoneNumber();
        const data = await Promise.race([apiPromise, timeoutPromise]);

        console.log("Phone API response:", data);

        // Handle different response structures
        let phoneNumber: string | null = null;

        if (typeof data === "string") {
          phoneNumber = data;
        } else if (data && typeof data === "object") {
          phoneNumber =
            (data as any)?.phone_number ||
            (data as any)?.number ||
            (data as any)?.phone;
        }

        console.log("Extracted phone number:", phoneNumber);

        if (
          typeof phoneNumber === "string" &&
          phoneNumber.trim() &&
          phoneNumber !== "00000000"
        ) {
          setGlobalPhoneNumber(phoneNumber.trim());
          console.log("Setting global phone number to:", phoneNumber.trim());
        } else {
          // Use fallback if API returns invalid data or "00000000"
          const fallbackNumber = "1234567890";
          setGlobalPhoneNumber(fallbackNumber);
          console.log("Using fallback phone number:", fallbackNumber);
        }
      } catch (err) {
        console.error("Failed to fetch global phone number:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Use fallback on error
        const fallbackNumber = "1234567890";
        setGlobalPhoneNumber(fallbackNumber);
        console.log(
          "Using fallback phone number due to error:",
          fallbackNumber
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalPhone();
  }, [globalPhoneNumber]);

  return (
    <PhoneContext.Provider value={{ globalPhoneNumber, isLoading, error }}>
      {children}
    </PhoneContext.Provider>
  );
};
