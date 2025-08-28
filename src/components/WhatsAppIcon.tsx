"use client";

import React, { useState, useEffect } from "react";
import { usePhone } from "../contexts/PhoneContext";

const WhatsAppIcon: React.FC<{ number?: string }> = ({ number }) => {
  const [displayNumber, setDisplayNumber] = useState<string>("");
  const { globalPhoneNumber, isLoading } = usePhone();

  useEffect(() => {
    // If a valid number is passed via props, use it immediately
    if (number && number.trim()) {
      setDisplayNumber(number);
      return;
    }

    // If no valid number, use the global phone number from context
    if (globalPhoneNumber) {
      setDisplayNumber(globalPhoneNumber);
    }
  }, [number, globalPhoneNumber]);

  // Don't render while loading global phone number
  if (isLoading && !displayNumber) {
    return null;
  }

  // Do not render the component if there is no valid number to use.
  if (
    !displayNumber ||
    typeof displayNumber !== "string" ||
    !displayNumber.trim()
  ) {
    return null;
  }

  // Ensure we have a valid string before calling replace
  const cleanNumber = displayNumber.replace(/\D/g, "");

  // Don't render if we don't have any digits after cleaning
  if (!cleanNumber) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-10 right-6 z-50 bg-green-500 rounded-full shadow-lg p-3 hover:bg-green-600 transition-colors"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      aria-label="Chat on WhatsApp"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#25D366" />
        <path
          d="M23.5 19.5C22.8333 19.5 22.1667 19.5 21.5 19.5C21.1667 19.5 20.8333 19.5 20.5 19.5C20.1667 19.5 19.8333 19.5 19.5 19.5C19.1667 19.5 18.8333 19.5 18.5 19.5C18.1667 19.5 18.8333 19.5 17.5 19.5C17.1667 19.5 16.8333 19.5 16.5 19.5C16.1667 19.5 15.8333 19.5 15.5 19.5C15.1667 19.5 14.8333 19.5 14.5 19.5C14.1667 19.5 13.8333 19.5 13.5 19.5C13.1667 19.5 12.8333 19.5 12.5 19.5C12.1667 19.5 11.8333 19.5 11.5 19.5C11.1667 19.5 10.8333 19.5 10.5 19.5C10.1667 19.5 9.83333 19.5 9.5 19.5C9.16667 19.5 8.83333 19.5 8.5 19.5C8.16667 19.5 7.83333 19.5 7.5 19.5C7.16667 19.5 6.83333 19.5 6.5 19.5C6.16667 19.5 5.83333 19.5 5.5 19.5C5.16667 19.5 4.83333 19.5 4.5 19.5C4.16667 19.5 3.83333 19.5 3.5 19.5C3.16667 19.5 2.83333 19.5 2.5 19.5C2.16667 19.5 1.83333 19.5 1.5 19.5C1.16667 19.5 0.833333 19.5 0.5 19.5C0.166667 19.5 -0.166667 19.5 -0.5 19.5"
          fill="#fff"
        />
        <path
          d="M16 6C10.4772 6 6 10.4772 6 16C6 17.6569 6.52784 19.1566 7.42893 20.4289L6 26L11.5711 24.5711C12.8434 25.4722 14.3431 26 16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6ZM16 24C14.6362 24 13.3239 23.5978 12.2148 22.8571L12 22.7143L8.85714 23.5714L9.71429 20.4286L9.57143 20.2143C8.80267 19.1052 8.4 17.7929 8.4 16.4286C8.4 11.8571 11.8571 8.4 16.4286 8.4C21 8.4 24.4571 11.8571 24.4571 16.4286C24.4571 21 21 24.4571 16.4286 24.4571C16.2857 24.4571 16.1429 24.4571 16 24.4571V24Z"
          fill="#fff"
        />
      </svg>
    </a>
  );
};

export default WhatsAppIcon;
