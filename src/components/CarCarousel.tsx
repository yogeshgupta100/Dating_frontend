import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarCarouselProps {
  images: string[];
  altTexts?: string[];
  title?: string;
}

const CarCarousel: React.FC<CarCarouselProps> = ({ 
  images, 
  altTexts = [], 
  title = "Premium Escort Gallery" 
}) => {
  const initialIndex = Math.floor(images.length / 2);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const absIndex = Math.abs(diff);
    
    if (absIndex === 0) {
      return {
        transform: 'translateX(0%) scale(1)',
        zIndex: 30,
        opacity: 1,
      };
    } else if (absIndex === 1) {
      const direction = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 60}%) scale(0.85)`,
        zIndex: 20,
        opacity: 0.9,
      };
    } else if (absIndex === 2) {
      const direction = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 100}%) scale(0.7)`,
        zIndex: 10,
        opacity: 0.6,
      };
    } else {
      const direction = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 120}%) scale(0.6)`,
        zIndex: 1,
        opacity: 0.3,
      };
    }
  };

  const getAltText = (index: number) => {
    if (altTexts[index]) {
      return altTexts[index];
    }
    return `${title} - Image ${index + 1} of ${images.length}`;
  };

  return (
    <section 
      className="relative w-full max-w-6xl mx-auto px-4"
      aria-label={title}
      role="region"
    >
      <div className="relative h-80 md:h-96 overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 w-80 md:w-96 h-56 md:h-96 cursor-pointer transition-all duration-500 ease-in-out"
            style={{
              ...getCardStyle(index),
              transform: `translate(-50%, -50%) ${getCardStyle(index).transform}`,
            }}
            onClick={() => goToSlide(index)}
            role="button"
            tabIndex={0}
            aria-label={`View ${getAltText(index)}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
              }
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <img
                src={image}
                alt={getAltText(index)}
                className="w-full h-full object-contain"
                loading={index <= 2 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === currentIndex ? "high" : "low"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-30"
        disabled={isTransitioning}
        aria-label="Previous image"
        title="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-30"
        disabled={isTransitioning}
        aria-label="Next image"
        title="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <nav 
        className="flex justify-center space-x-2 mt-8"
        aria-label="Image navigation"
        role="navigation"
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-red-500 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            disabled={isTransitioning}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </nav>

      {/* Screen reader status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Showing image ${currentIndex + 1} of ${images.length}: ${getAltText(currentIndex)}`}
      </div>
    </section>
  );
};

export default CarCarousel;