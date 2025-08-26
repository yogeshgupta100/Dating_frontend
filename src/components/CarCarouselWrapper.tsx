"use client";

import CarCarousel from "./CarCarousel";

interface CarCarouselWrapperProps {
  images: string[];
  altTexts?: string[];
  title?: string;
}

export default function CarCarouselWrapper({
  images,
  altTexts,
  title,
}: CarCarouselWrapperProps) {
  return <CarCarousel images={images} altTexts={altTexts} title={title} />;
}
