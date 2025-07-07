"use client";

import Disclaimer from "./Disclaimer";
import ProfileHero from "./ProfileHero";
import { CheckCircle, Heart, Star, Sparkles } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import PhoneIcon from "./PhoneIcon";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProfile, getProfileBySlug } from "../services/models";
import { Model } from "../services";
import { STATIC_SERVICES, SERVICE_CATEGORIES } from "../constants/services";
import { slugToText } from "../utils/slug";
import { useProfileStore } from "../store/profileStore";
import Tick from "../assets/svgs/Tick.svg";
import { renderHtmlContent } from "../utils/htmlUtils";
import { LoadingSpinner } from "./LoadingSpinner";
import banner_img from "../../public/banner_img.jpeg";

export default function ModelPageClient() {
  const params = useParams();
  const locationSlug = (params?.locationSlug as string) || "";
  const modelSlug = (params?.modelSlug as string) || "";
  const { selectedProfileId, clearSelectedProfileId } = useProfileStore();

  const [profile, setProfiles] = useState<Model>();
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Services");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching profile with:", { selectedProfileId, modelSlug });

        let profileData;

        // Get profile by id from store
        if (selectedProfileId) {
          console.log("Fetching by ID:", selectedProfileId);
          profileData = await getProfile(selectedProfileId);
        } else {
          console.log("Fetching by slug:", modelSlug);
          profileData = await getProfileBySlug(modelSlug);

          // If slug fetch fails, try to extract ID from slug and fetch by ID
          if (!profileData && modelSlug) {
            console.log("Slug fetch failed, trying to extract ID from slug");
            // Try to extract numeric ID from slug (assuming slug format like "delhi-girls-1")
            const idMatch = modelSlug.match(/(\d+)$/);
            if (idMatch) {
              const extractedId = idMatch[1];
              console.log("Extracted ID from slug:", extractedId);
              try {
                profileData = await getProfile(extractedId);
              } catch (idError) {
                console.log("ID fetch also failed:", idError);
              }
            }
          }
        }

        console.log("Profile data received:", profileData);

        if (profileData) {
          setProfiles(profileData);
        } else {
          setError("Profile not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (modelSlug) {
      fetchProfile();
    }
  }, [selectedProfileId, modelSlug]);

  // Clear the selected profile ID when component unmounts
  useEffect(() => {
    return () => {
      clearSelectedProfileId();
    };
  }, [clearSelectedProfileId]);

  const profileName =
    profile?.name ||
    profile?.heading ||
    slugToText(modelSlug || "") ||
    "Escort Profile";
  const locationName = slugToText(locationSlug || "") || "Pokkoo";
  const pageTitle = `${profileName} - Premium Escort Service in ${locationName}`;
  const pageDescription =
    profile?.description ||
    `Premium escort service featuring ${profileName} in ${locationName}. Safe, discreet, and professional escort services with verified profiles.`;
  const pageKeywords = `${profileName}, ${locationName} escorts, call girls ${locationName}, escort service ${locationName}, verified escorts, premium call girls`;

  const profilePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: `https://pokkoo.in/${locationSlug}/${modelSlug}`,
    mainEntity: {
      "@type": "Person",
      name: profileName,
      description: profile?.description,
      image: profile?.profile_img,
      url: `https://pokkoo.in/${locationSlug}/${modelSlug}`,
      jobTitle: "Escort",
      worksFor: {
        "@type": "Organization",
        name: `${locationName} Escorts Service`,
      },
      knowsAbout: STATIC_SERVICES,
      address: {
        "@type": "PostalAddress",
        addressLocality: locationName,
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://pokkoo.in",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locationName,
          item: `https://pokkoo.in/${locationSlug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: profileName,
          item: `https://pokkoo.in/${locationSlug}/${modelSlug}`,
        },
      ],
    },
  };

  const getFilteredServices = () => {
    if (selectedCategory === "All Services") {
      return STATIC_SERVICES;
    }
    return (
      SERVICE_CATEGORIES[selectedCategory as keyof typeof SERVICE_CATEGORIES] ||
      STATIC_SERVICES
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Intimate Services":
        return <Heart className="w-4 h-4" />;
      case "Companionship":
        return <Star className="w-4 h-4" />;
      case "Special Services":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" text="Loading profile..." />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-sm">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors w-full sm:w-auto"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {!loading && !error && profile && (
          <>
            <ProfileHero banner_img={banner_img?.src} />

            {/* Profile Section - Mobile Optimized */}
            <div className="pt-6 md:pt-12 px-4 md:px-24 w-full mx-auto flex flex-col md:flex-row md:gap-20 items-start bg-gray-50 justify-between">
              {/* Profile Image - Mobile Responsive */}
              <div className="w-full md:w-96 mb-6 md:mb-0 flex justify-center md:justify-start">
                <div className="w-80 h-80 md:w-96 md:h-96">
                  <img
                    src={
                      (profile?.profile_img as any) ?? "/default-profile.jpg"
                    }
                    alt={(profile?.name as any) ?? "Profile"}
                    className="w-full h-full rounded-xl object-cover shadow-lg bg-white"
                  />
                </div>
              </div>

              {/* Profile Info - Mobile Optimized */}
              <div className="flex flex-col w-full md:w-auto md:py-8">
                {/* <div className="flex items-center justify-center md:justify-start mb-4 md:mb-4">
                  <div className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mr-2 font-serif text-center md:text-left">
                    {profile?.name}
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <Tick
                      className="w-7 h-7 md:w-7 md:h-7"
                      alt="Verified"
                      />
                    </div>
                </div> */}

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

                {/* Category Filter - Mobile Optimized */}
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {["All Services", ...Object.keys(SERVICE_CATEGORIES)].map(
                      (category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-2 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                            selectedCategory === category
                              ? "bg-pink-500 text-white shadow-lg transform scale-105"
                              : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Services Grid - Mobile Optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-3">
                  {getFilteredServices().map((service, idx) => (
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
                    {getFilteredServices().length} premium services available
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
                  <PhoneIcon number={profile?.phone_number || ""} />
                </section>
                <section className="flex-1 md:flex-none">
                  <WhatsAppIcon number={profile?.phone_number || ""} />
                </section>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
