"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ModelPageLoading from "./ModelPageLoading";
import Header from "./Header";
import Footer from "./Footer";
import Disclaimer from "./Disclaimer";
import ProfileHero from "./ProfileHero";
import WhatsAppIcon from "./WhatsAppIcon";
import PhoneIcon from "./PhoneIcon";
import { CheckCircle, Sparkles } from "lucide-react";
import { renderHtmlContent } from "../utils/htmlUtils";
import { STATIC_SERVICES } from "../constants/services";
import banner_img from "../../public/banner_img.jpeg";
import { getProfileBySlug, getProfile } from "../services/models";
import { getLocationBySlug } from "../services/Locations";
import { ensureHttpsUrl } from "../utils/imageUtils";

interface ModelPageClientProps {
  profile: any;
  location: any;
  locationSlug: string;
  modelSlug: string;
}

// Client-side cache for immediate responses
const clientCache = new Map<string, { data: any; timestamp: number }>();
const CLIENT_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const getCachedData = (key: string): any => {
  const cached = clientCache.get(key);
  if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any): void => {
  clientCache.set(key, { data, timestamp: Date.now() });
};

const ModelPageClient: React.FC<ModelPageClientProps> = ({
  profile: initialProfile,
  location: initialLocation,
  locationSlug,
  modelSlug,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Fetch data with aggressive caching
  const fetchData = useCallback(async () => {
    try {
      // Check cache first for immediate response
      const profileCacheKey = `profile-${modelSlug}`;
      const locationCacheKey = `location-${locationSlug}`;

      const cachedProfile = getCachedData(profileCacheKey);
      const cachedLocation = getCachedData(locationCacheKey);

      if (cachedProfile && cachedLocation) {
        setProfile(cachedProfile);
        setLocation(cachedLocation);
        setIsLoading(false);
        return;
      }

      // Fetch data in parallel with short timeout
      const [profileResult, locationResult] = await Promise.allSettled([
        getProfileBySlug(modelSlug),
        getLocationBySlug(locationSlug),
      ]);

      let profileData: any = null;
      let locationData: any = null;

      // Handle profile result
      if (profileResult.status === "fulfilled" && profileResult.value) {
        profileData = profileResult.value;
      } else if (profileResult.status === "rejected") {
        // Try fallback with ID extraction
        const idMatch = modelSlug.match(/(\d+)$/);
        if (idMatch) {
          try {
            const fallbackProfile = await getProfile(idMatch[1]);
            if (fallbackProfile) {
              profileData = fallbackProfile;
            }
          } catch (idError) {
            console.log("ID fetch also failed:", idError);
          }
        }
      }

      // Handle location result
      if (locationResult.status === "fulfilled") {
        locationData = locationResult.value;
      }

      // Cache the results
      if (profileData) {
        setCachedData(profileCacheKey, profileData);
      }
      if (locationData) {
        setCachedData(locationCacheKey, locationData);
      }

      setProfile(profileData);
      setLocation(locationData);

      if (!profileData) {
        setError("Profile not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [modelSlug, locationSlug]);

  useEffect(() => {
    // Mark as client-side to avoid hydration issues
    setIsClient(true);

    // If we have initial data, use it immediately
    if (initialProfile && initialLocation) {
      setProfile(initialProfile);
      setLocation(initialLocation);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch data client-side
    fetchData();
  }, [initialProfile, initialLocation, fetchData]);

  // Show loading state during SSR and initial client render
  if (!isClient || isLoading) {
    return <ModelPageLoading />;
  }

  if (error || !profile) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-sm">
            <p className="text-red-600 text-lg mb-4">
              {error || "Profile not found"}
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const profileName = profile?.name || profile?.heading || "Escort Profile";
  const locationName = location?.name || "Pokkoo";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ProfileHero banner_img={banner_img?.src} />

        {/* Profile Section - Mobile Optimized */}
        <div
          id="home"
          className="pt-6 md:pt-12 px-4 md:px-24 w-full mx-auto flex flex-col md:flex-row md:gap-20 items-start bg-gray-50 justify-between"
        >
          {/* Profile Image - Mobile Responsive */}
          <div className="w-full md:w-96 mb-6 md:mb-0 flex justify-center md:justify-start">
            <div className="w-80 h-80 md:w-96 md:h-96">
              <img
                src={
                  ensureHttpsUrl(profile?.profile_img as any) ??
                  "/default-profile.jpg"
                }
                alt={(profile?.name as any) ?? "Profile"}
                className="w-full h-full rounded-xl object-cover shadow-lg bg-white"
                loading="eager"
              />
            </div>
          </div>

          {/* Profile Info - Mobile Optimized */}
          <div className="flex flex-col w-full md:w-auto md:py-8">
            {/* Heading */}
            <div className="w-full mb-4 md:mb-0 location-content">
              <h1 className=" mb-4">{profile?.heading}</h1>
            </div>

            {/* Description */}
            <div className="w-full location-content">
              <div
                className="px-2 md:px-0 location-content"
                dangerouslySetInnerHTML={renderHtmlContent(
                  profile?.description || ""
                )}
              />
            </div>
          </div>
        </div>

        {/* Services Section - Mobile Optimized */}
        <div className="px-4 md:px-24">
          <div className="mt-8 md:mt-28 w-full">
            {/* Section Header */}
            <div className="flex items-center justify-center md:justify-start mb-6 md:mb-4">
              <Sparkles className="w-5 h-5 text-pink-500 mr-2" />
              <span className="text-xl md:text-2xl font-bold text-gray-900 text-center md:text-center">
                Premium Services
              </span>
            </div>

            {/* Services Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-3">
              {STATIC_SERVICES.map((service, idx) => (
                <div
                  key={idx}
                  className="group bg-white px-4 py-3 md:py-3 rounded-xl text-gray-800 font-medium shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 flex items-center border border-gray-100"
                >
                  <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-pink-100 text-pink-600 mr-3 group-hover:bg-pink-200 transition-colors duration-200 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 md:w-3 md:h-3" />
                  </div>
                  <span className="text-xs md:text-sm leading-tight">
                    {service}
                  </span>
                </div>
              ))}
            </div>

            {/* Service Count */}
            <div className="mt-4 text-center md:text-center">
              <span className="text-xs md:text-sm text-gray-600">
                {STATIC_SERVICES.length} premium services available
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer - Mobile Optimized */}
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Disclaimer />
        </div>

        {/* Contact Buttons - Mobile Optimized */}
        <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto z-50">
          <div className="flex gap-3 md:flex-col md:gap-4">
            <section className="flex-1 md:flex-none">
              <PhoneIcon
                number={
                  (profile?.phone_number &&
                    profile.phone_number !== "00000000") ||
                  (location?.phone_number &&
                    location.phone_number !== "00000000")
                    ? profile?.phone_number &&
                      profile.phone_number !== "00000000"
                      ? profile.phone_number
                      : location.phone_number
                    : undefined
                }
              />
            </section>
            <section className="flex-1 md:flex-none">
              <WhatsAppIcon
                number={
                  (profile?.phone_number &&
                    profile.phone_number !== "00000000") ||
                  (location?.phone_number &&
                    location.phone_number !== "00000000")
                    ? profile?.phone_number &&
                      profile.phone_number !== "00000000"
                      ? profile.phone_number
                      : location.phone_number
                    : undefined
                }
              />
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ModelPageClient;
