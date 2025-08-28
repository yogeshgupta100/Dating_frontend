"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const ModelPageLoading: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Banner skeleton */}
        <div className="relative bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white h-32 md:h-48">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Profile Section skeleton */}
        <div className="pt-6 md:pt-12 px-4 md:px-24 w-full mx-auto flex flex-col md:flex-row md:gap-20 items-start bg-gray-50 justify-between">
          {/* Profile Image skeleton */}
          <div className="w-full md:w-96 mb-6 md:mb-0 flex justify-center md:justify-start">
            <div className="w-80 h-80 md:w-96 md:h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Profile Info skeleton */}
          <div className="flex flex-col w-full md:w-auto md:py-8">
            {/* Heading skeleton */}
            <div className="w-full mb-4 md:mb-0">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>

            {/* Description skeleton */}
            <div className="w-full">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section skeleton */}
        <div className="px-4 md:px-24">
          <div className="mt-8 md:mt-28 w-full">
            {/* Section Header skeleton */}
            <div className="flex items-center justify-center md:justify-start mb-6 md:mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
            </div>

            {/* Services Grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white px-4 py-3 md:py-3 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading spinner in center */}
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading profile..." />
        </div>
      </div>
    </>
  );
};

export default ModelPageLoading;
