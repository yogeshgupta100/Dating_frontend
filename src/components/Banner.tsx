import { useState, useEffect } from 'react';

export const Banner = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if element is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="mx-auto">
        {isVisible && (
          <video 
            src="/callgirlvideo.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onLoadedData={() => setIsVideoLoaded(true)}
            style={{ opacity: isVideoLoaded ? 1 : 0 }}
          />
        )}
        {!isVideoLoaded && (
          <div className="w-full h-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 animate-pulse" />
        )}
      </div>
    </section>
  );
};