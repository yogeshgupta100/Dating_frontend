"use client";

import React, { useState, useEffect } from "react";
import { usePhone } from "../contexts/PhoneContext";

const PhoneIcon: React.FC<{ number?: string }> = ({ number }) => {
  const [displayNumber, setDisplayNumber] = useState<string>("");
  const { globalPhoneNumber, isLoading } = usePhone();

  useEffect(() => {
    console.log("PhoneIcon - Received number prop:", number);
    console.log("PhoneIcon - Global phone number:", globalPhoneNumber);

    // If a valid number is passed via props, use it immediately
    if (number && number.trim()) {
      console.log("PhoneIcon - Using provided number:", number);
      setDisplayNumber(number);
      return;
    }

    // If no valid number, use the global phone number from context
    if (globalPhoneNumber) {
      console.log("PhoneIcon - Using global phone number:", globalPhoneNumber);
      setDisplayNumber(globalPhoneNumber);
    }
  }, [number, globalPhoneNumber]);

  // Don't render while loading global phone number
  if (isLoading && !displayNumber) {
    console.log("PhoneIcon - Not rendering due to loading state");
    return null;
  }

  // Do not render the component if there is no valid number to use.
  if (
    !displayNumber ||
    typeof displayNumber !== "string" ||
    !displayNumber.trim()
  ) {
    console.log(
      "PhoneIcon - Not rendering due to invalid display number:",
      displayNumber
    );
    return null;
  }

  // Ensure we have a valid string before calling replace
  const cleanNumber = displayNumber.replace(/\D/g, "");

  // Don't render if we don't have any digits after cleaning
  if (!cleanNumber) {
    console.log("PhoneIcon - Not rendering due to no digits after cleaning");
    return null;
  }

  console.log("PhoneIcon - Rendering with clean number:", cleanNumber);

  return (
    <a
      href={`tel:${cleanNumber}`}
      className="fixed bottom-28 right-6 z-50 bg-orange-500 rounded-full shadow-lg p-3 hover:bg-orange-600 transition-colors"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      aria-label="Call Now"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 003.69.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17.9 17.9 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.69 1 1 0 01-.27 1.11l-2.2 2.2z" />
      </svg>
    </a>
  );
};

export default PhoneIcon;
