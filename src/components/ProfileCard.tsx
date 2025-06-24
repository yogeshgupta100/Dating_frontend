import React, { useEffect, useState } from 'react';

interface ProfileCardProps {
  img: File | string;
  heading: string;
  desc: string;
  onClick?: () => void;
  location?: string;
  age?: number;
  services?: string[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  img, 
  heading, 
  desc, 
  onClick,
  location,
  age,
  services = []
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    let objectUrl: string | undefined;
    
    if (img instanceof File) {
      objectUrl = URL.createObjectURL(img);
      setImageSrc(objectUrl);
    } else if (typeof img === 'string') {
      // Cloudinary URLs are short and safe to use directly
      setImageSrc(img);
    }

    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [img]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const getAltText = () => {
    const parts = [heading];
    if (location) parts.push(location);
    if (age) parts.push(`${age} years old`);
    return `${parts.join(', ')} - Escort Profile`;
  };

  const CardContent = () => (
    <>
      <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-2xl">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={getAltText()}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500" aria-hidden="true">👤</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-start px-6 w-full h-32 md:h-full overflow-hidden">
        <header>
          <h2 className="text-lg md:text-2xl font-semibold mb-2">{heading}</h2>
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
        <p className="text-gray-800 text-base leading-snug line-clamp-3 md:line-clamp-4">{desc}</p>
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

  if (onClick) {
    return (
      <article
        className="w-full bg-white rounded-2xl shadow-md flex flex-row items-stretch p-4 md:px-4 mb-6 mx-auto cursor-pointer hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-opacity-50"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View profile of ${heading}`}
      >
        <CardContent />
      </article>
    );
  }

  return (
    <article className="w-full bg-white rounded-2xl shadow-md flex flex-row items-stretch p-4 md:px-4 mb-6 mx-auto">
      <CardContent />
    </article>
  );
};

export default ProfileCard;