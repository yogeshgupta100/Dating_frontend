"use client";

import React from "react";
import { renderHtmlContent } from "../utils/htmlUtils";

interface ProfileCardProps {
  img: File | string;
  heading: string;
  desc: string;
  location?: string;
  age?: number;
  services?: string[];
}

// Client component for handling File objects
const ClientImageHandler: React.FC<{ img: File | string; alt: string }> = ({
  img,
  alt,
}) => {
  const [imageSrc, setImageSrc] = React.useState<string>("");
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);

    if (img instanceof File) {
      const objectUrl = URL.createObjectURL(img);
      setImageSrc(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof img === "string") {
      setImageSrc(img);
    }
  }, [img]);

  // Show placeholder during SSR or while loading
  if (!isClient || !imageSrc) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500" aria-hidden="true">
          👤
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      decoding="async"
    />
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  img,
  heading,
  desc,
  location,
  age,
  services = [],
}) => {
  const getAltText = () => {
    const parts = [heading];
    if (location) parts.push(location);
    if (age) parts.push(`${age} years old`);
    return `${parts.join(", ")} - Escort Profile`;
  };

  const CardContent = () => (
    <>
      <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-2xl">
        {img instanceof File ? (
          <ClientImageHandler img={img} alt={getAltText()} />
        ) : typeof img === "string" && img ? (
          <img
            src={img}
            alt={getAltText()}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500" aria-hidden="true">
              👤
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start px-6 w-full h-32 md:h-full overflow-hidden">
        <header>
          <h2 className="text-lg md:text-2xl font-semibold text-black mb-2">
            {heading}
          </h2>
          {(location || age) && (
            <div className="hidden md:flex items-center gap-4 mb-2 text-sm text-gray-600">
              {location && (
                <span className="flex items-center">
                  <span className="sr-only sm:hidden">Location:</span>
                  📍 {location}
                </span>
              )}
              {age && (
                <span className="flex items-center">
                  <span className="sr-only">Age:</span>
                  🎂 {age} years
                </span>
              )}
            </div>
          )}
        </header>
        <div
          className="text-gray-800 text-base leading-snug line-clamp-2 md:line-clamp-3 location-content"
          dangerouslySetInnerHTML={renderHtmlContent(desc)}
        />
        {services.length > 0 && (
          <div className="mt-2 hidden md:block">
            <span className="sr-only">Services offered:</span>
            <div className="flex flex-wrap gap-1">
              {services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                >
                  {service}
                </span>
              ))}
              {services.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <article className="w-full bg-white rounded-2xl shadow-md flex flex-row items-stretch p-4 md:px-4 mb-6 mx-auto cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent />
    </article>
  );
};

export default ProfileCard;
