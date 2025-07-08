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

        const phoneNumber = (data as any)?.phone_number;

        if (typeof phoneNumber === "string" && phoneNumber.trim()) {
          setGlobalPhoneNumber(phoneNumber);
        } else {
          // Use fallback if API returns invalid data
          setGlobalPhoneNumber("1234567890");
        }
      } catch (err) {
        console.error("Failed to fetch global phone number:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Use fallback on error
        setGlobalPhoneNumber("1234567890");
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
