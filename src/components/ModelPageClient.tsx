'use client';

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
import { useProfileStore } from '../store/profileStore';
import Tick from "../assets/svgs/Tick.svg";
import { renderHtmlContent } from "../utils/htmlUtils";

export default function ModelPageClient() {
  const params = useParams();
  const locationSlug = params?.locationSlug as string || '';
  const modelSlug = params?.modelSlug as string || '';
  const { selectedProfileId, clearSelectedProfileId } = useProfileStore();
  
  const [profile, setProfiles] = useState<Model>();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Services");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching profile with:', { selectedProfileId, modelSlug });
        
        let profileData;
        
        // Get profile by id from store
        if (selectedProfileId) {
          console.log('Fetching by ID:', selectedProfileId);
          profileData = await getProfile(selectedProfileId);
        } else {
          console.log('Fetching by slug:', modelSlug);
          profileData = await getProfileBySlug(modelSlug);
          
          // If slug fetch fails, try to extract ID from slug and fetch by ID
          if (!profileData && modelSlug) {
            console.log('Slug fetch failed, trying to extract ID from slug');
            // Try to extract numeric ID from slug (assuming slug format like "delhi-girls-1")
            const idMatch = modelSlug.match(/(\d+)$/);
            if (idMatch) {
              const extractedId = idMatch[1];
              console.log('Extracted ID from slug:', extractedId);
              try {
                profileData = await getProfile(extractedId);
              } catch (idError) {
                console.log('ID fetch also failed:', idError);
              }
            }
          }
        }
        
        console.log('Profile data received:', profileData);
        
        if (profileData) {
          setProfiles(profileData);
        } else {
          setError('Profile not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
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

  const profileName = profile?.name || profile?.heading || slugToText(modelSlug || '') || 'Escort Profile';
  const locationName = slugToText(locationSlug || '') || 'Jaipur';
  const pageTitle = `${profileName} - Premium Escort Service in ${locationName}`;
  const pageDescription = profile?.description || `Premium escort service featuring ${profileName} in ${locationName}. Safe, discreet, and professional escort services with verified profiles.`;
  const pageKeywords = `${profileName}, ${locationName} escorts, call girls ${locationName}, escort service ${locationName}, verified escorts, premium call girls`;

  const profilePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": `https://pro.abellarora.com/${locationSlug}/${modelSlug}`,
    "mainEntity": {
      "@type": "Person",
      "name": profileName,
      "description": profile?.description,
      "image": profile?.profile_img,
      "url": `https://pro.abellarora.com/${locationSlug}/${modelSlug}`,
      "jobTitle": "Escort",
      "worksFor": {
        "@type": "Organization",
        "name": `${locationName} Escorts Service`
      },
      "knowsAbout": STATIC_SERVICES,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": locationName,
        "addressRegion": "Rajasthan",
        "addressCountry": "IN"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://pro.abellarora.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": locationName,
          "item": `https://pro.abellarora.com/${locationSlug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": profileName,
          "item": `https://pro.abellarora.com/${locationSlug}/${modelSlug}`
        }
      ]
    }
  };

  const getFilteredServices = () => {
    if (selectedCategory === "All Services") {
      return STATIC_SERVICES;
    }
    return SERVICE_CATEGORIES[selectedCategory as keyof typeof SERVICE_CATEGORIES] || STATIC_SERVICES;
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
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.history.back()} 
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
        
        {!loading && !error && profile && (
          <>
            <ProfileHero profile_img={profile?.profile_img as any} banner_img={profile?.banner_img as any} name={profile?.name as any} />
            <div className="md:ml-32 pt-12 md:pt-24 w-full mx-auto px-4 md:px-12 flex flex-col md:flex-row md:gap-20 items-start bg-gray-50 md:p-8 lg:p-20 justify-between">
              <div className="flex flex-col md:items-start w-full md:w-1/3 min-w-0 md:min-w-[400px] md:pt-8">
                <div className="flex items-center mb-2 relative justify-center">
                  <span className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mr-2 font-serif text-center md:text-left">
                    {profile?.name}
                  </span>
                  {/* {profile?.verified && ( */}
                  <div className="flex items-center justify-center md:justify-start">
                    <Tick 
                      className="w-full h-full md:w-7 md:h-7" 
                      alt="Verified"
                    />
                  </div>
                  {/* )} */}
                </div>
                
              </div>
              <div className="flex flex-col items-center md:items-start w-full md:w-2/3 min-w-0 md:min-w-[600px] mt-2 md:mt-0 md:pt-8 md:pr-24">
                <h1 className="text-xl md:text-2xl text-gray-900 font-bold leading-relaxed font-sans mb-4 text-center md:text-left">
                  {profile?.heading}
                </h1>
                <div className="flex-1 flex items-center justify-center md:justify-start mt-4 md:mt-4 md:pr-16">
                  <div
                    className="text-lg md:text-xl text-gray-900 leading-relaxed font-sans font-light text-center md:text-left location-content"
                    dangerouslySetInnerHTML={renderHtmlContent(profile?.description || "")}
                  />
                </div>
              </div>
            </div>

            <div className="px-8 md:px-24">
            <div className="mt-8 md:mt-28 w-full">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <Sparkles className="w-5 h-5 text-pink-500 mr-2" />
                    <span className="text-xl md:text-2xl font-bold text-gray-900 text-center md:text-left">
                      Premium Services
                    </span>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="mb-6">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                      {["All Services", ...Object.keys(SERVICE_CATEGORIES)].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedCategory === category
                              ? "bg-pink-500 text-white shadow-lg transform scale-105"
                              : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getFilteredServices().map((service, idx) => (
                      <div
                        key={idx}
                        className="group bg-white px-4 py-3 rounded-xl text-gray-800 font-medium shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 flex items-center border border-gray-100"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-600 mr-3 group-hover:bg-pink-200 transition-colors duration-200">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        <span className="text-sm leading-tight">{service}</span>
                      </div>
                    ))}
                  </div>

                  {/* Service Count */}
                  <div className="mt-4 text-center md:text-left">
                    <span className="text-sm text-gray-600">
                      {getFilteredServices().length} premium services available
                    </span>
                  </div>
                </div>
            </div>
            
            <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              <Disclaimer />
            </div>

            <section>
              <PhoneIcon number={profile?.phone_number || ''}/>
            </section>
            
            <section>
              <WhatsAppIcon number={profile?.phone_number || ''}/>
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
} 