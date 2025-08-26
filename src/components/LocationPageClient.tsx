"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Heart, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react";
import CarCarousel from "./CarCarousel";
import ProfileCard from "./ProfileCard";
import Disclaimer from "./Disclaimer";
import WhatsAppIcon from "./WhatsAppIcon";
import PhoneIcon from "./PhoneIcon";
import Header from "./Header";
import Footer from "./Footer";
import { getModels } from "../services/models";
import { LocationResponse, Model } from "../services";
import {
  getLocationBySlug,
  getLocations,
  getLocationById,
} from "../services/Locations";
import { Banner } from "./Banner";
import { api } from "../services/api";
import {
  slugToText,
  generatePageTitle,
  generateMetaDescription,
  generateProfileSlug,
} from "../utils/slug";
import { useProfileStore } from "../store/profileStore";
import { renderHtmlContent } from "../utils/htmlUtils";
import { VerifiedSection } from "./VerifiedSection";
import Gallery from "./Gallery";

const galleryImages = [
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050380/dating-app/banners/fefp5wju9louqsqy9j2d.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/profiles/byl4mt7g46ewv6jzoe87.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050459/dating-app/banners/az09b062duh3bceedxzl.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/banners/skse6swh4lklbzigazx9.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050458/dating-app/profiles/fgsym9bjyi9mxxumhpje.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050379/dating-app/profiles/sjinrqpbizy9qdri4kqz.jpg",
];

export default function LocationPageClient() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<Model[]>([]);
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [faqData, setFaqData] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const locationSlug = params?.locationSlug as string;
  const { setSelectedProfileId } = useProfileStore();

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to get location by slug
        let locationData = await getLocationBySlug(locationSlug || "");

        // If not found by slug, try to get by ID (fallback)
        if (!locationData) {
          locationData = await getLocationById(locationSlug);
        }

        if (locationData) {
          setLocation(locationData);

          // Fetch profiles for this location
          const profilesData = await getModels(locationData.id.toString());
          setProfiles(profilesData);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchData();
  }, [locationSlug]);

  const formatLocationName = (locationName: string | undefined) => {
    if (!locationName) return "Featured Profiles";
    return locationName.charAt(0).toUpperCase() + locationName.slice(1);
  };

  const locationName = formatLocationName(
    location?.name || slugToText(locationSlug || "")
  );

  const profilesPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: generatePageTitle(locationSlug || ""),
    description: generateMetaDescription(
      locationSlug || "",
      location?.content || ""
    ),
    url: `https://pokkoo.in/${locationSlug}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${locationName} Escort Profiles`,
      description: `Verified escort profiles in ${locationName}`,
      numberOfItems: profiles.length,
      itemListElement: profiles.map((profile, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          name: profile.name || profile.heading,
          description: profile.description,
          image: profile.profile_img,
          url: `https://pokkoo.in/${locationSlug}/${
            profile.slug ||
            generateProfileSlug(
              profile.name || profile.heading || "profile",
              locationSlug || "location",
              profiles.map((p) => p.slug).filter(Boolean)
            )
          }`,
        },
      })),
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
      ],
    },
  };

  // Dynamic FAQ content using location name from API
  const faqs = [
    {
      question: `How to find call girl in ${location?.faq || locationName}?`,
      answer: `To get the top call girls in ${
        faqData || locationName
      }, it is essential to do your research and select a service with a strong reputation and a tested track report of happy clients. Also, you can go through reviews and consult friends or internet forums for hints.`,
    },
    {
      question: `How do I book a call girl in ${
        location?.faq || locationName
      } escorts?`,
      answer: `Book via WhatsApp, phone call, or online reservation; review profiles, choose your match, and quietly confirm the specifics.`,
    },
    {
      question: `Are the services safe and confidential?`,
      answer: `Indeed, reliable companies guarantee confidentiality, privacy, and professional behavior to provide a hassle free service.`,
    },
    {
      question: `What are the payment options?`,
      answer: `Pay with cash, UPI, credit cards, or safe digital transfers for a seamless, stress free booking.`,
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <Banner />

        <div id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 location-content">
            <h1 className=" mx-auto font-bold mb-4">{location?.heading}</h1>
            <div
              className="text-lg text-gray-800 max-w-6xl text-center mx-auto md:pt-4 location-content"
              dangerouslySetInnerHTML={renderHtmlContent(
                location?.sub_heading || ""
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mb-16">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                img={profile.profile_img || ""}
                heading={profile.name || profile.heading}
                desc={profile.description}
                location={location?.name}
                services={profile.services}
              />
            ))}
          </div>
          {profiles.length === 0 && <Gallery showHeading={false} />}

          <section className="mb-20">
            <div className="mb-12">
              <div
                className="bg-white p-8 rounded-2xl shadow-lg overflow-hidden location-content text-left"
                style={{ textAlign: "left" }}
                dangerouslySetInnerHTML={renderHtmlContent(
                  location?.content || ""
                )}
              />
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get answers to common questions about our{" "}
                {location?.faq || locationName} platform and services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-center flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <VerifiedSection />

          <section className="mb-20">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Success Stories Gallery
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Celebrating the beautiful connections made through our{" "}
                {faqData || locationName} platform.
              </p>
            </div>
            <CarCarousel images={galleryImages} />
          </section>

          <div className="max-w-6xl mx-auto">
            <Disclaimer />
          </div>
        </div>

        <section>
          <PhoneIcon number={location?.phone_number || ""} />
        </section>

        <section>
          <WhatsAppIcon number={location?.phone_number || ""} />
        </section>
      </div>
      <Footer />
    </>
  );
}
