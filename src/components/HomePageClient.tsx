"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCarousel from "./CarCarousel";
import { Play, Users, MapPin, Shield } from "lucide-react";
import Disclaimer from "./Disclaimer";
import WhatsAppIcon from "./WhatsAppIcon";
import { LocationResponse } from "../services";
import PhoneIcon from "./PhoneIcon";
import { getLocations } from "../services/Locations";
import { Banner } from "./Banner";
import { api } from "../services/api";
import { generateUniqueSlug } from "../utils/slug";
import Header from "./Header";
import Footer from "./Footer";
import { renderHtmlContent } from "../utils/htmlUtils";
import { VerifiedSection } from "./VerifiedSection";
import Gallery from "./Gallery";

const carImages = [
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050380/dating-app/banners/fefp5wju9louqsqy9j2d.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/profiles/byl4mt7g46ewv6jzoe87.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/banners/skse6swh4lklbzigazx9.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050458/dating-app/profiles/fgsym9bjyi9mxxumhpje.jpg",
  "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050379/dating-app/profiles/sjinrqpbizy9qdri4kqz.jpg",
];

const paragraph = `Building meaningful connections has never been more important in today's digital age. Our platform brings together like-minded individuals who are serious about finding genuine relationships. Through our advanced matching algorithm and personalized approach, we help create lasting bonds that go beyond surface-level attraction. Whether you're looking for companionship, friendship, or a life partner, we provide a safe and welcoming environment for authentic connections to flourish.`;

export default function HomePageClient() {
  const router = useRouter();
  const [states, setStates] = useState<LocationResponse[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleStateClick = (location: LocationResponse) => {
    // Use slug if available, otherwise generate one from name
    const slug =
      location.slug ||
      generateUniqueSlug(
        location.name,
        states.map((s) => s.slug).filter(Boolean)
      );
    router.push(`/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchStates = async () => {
      const states = await getLocations();
      setStates(states);
    };
    fetchStates();
    const phoneNumber = async () => {
      const phoneNumber = await api.getPhoneNumber();
      setPhoneNumber(phoneNumber);
    };
    phoneNumber();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <Banner />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <section className="mb-20">
            <div className="mb-12 location-content flex flex-col">
              <h1 className="mb-6 w-full text-center md:text-center lg:text-center">
                Mumbai Escorts Service offers Cash Payment & Free Delivery
              </h1>
              <div
                className="max-w-5xl mx-auto space-y-6 location-content text-center"
                dangerouslySetInnerHTML={renderHtmlContent(paragraph || "")}
              />
            </div>
          </section>

          {/* Car Carousel Section */}
          <section className="mb-20">
            <div className="text-center flex flex-col items-center mb-12 location-content">
              <h1 className="mb-4">100% Real Models</h1>
              <div className="max-w-2xl mx-auto location-content">
                Experience the finer things in life with like-minded individuals
                who share your passion for excellence.
              </div>
            </div>
            <CarCarousel images={carImages} />
          </section>

          {/* About Us Section */}
          <section id="about" className="mb-20">
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-6 location-content">
              {/* <div className="text-center location-content flex flex-col items-center"> */}
              <h2 className="mb-6">About Us</h2>
              {/* </div> */}
              <div className="space-y-6 leading-relaxed location-content">
                <div className="location-content">{paragraph}</div>
                <div className="location-content">{paragraph}</div>
                <div className="location-content">{paragraph}</div>
              </div>
            </div>
          </section>

          {/* People Gallery */}
          <Gallery />

          <VerifiedSection />

          {/* States Coverage */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8 location-content flex flex-col items-center">
                <h2 className="mb-4">States We Cover</h2>
                <div className="location-content">
                  Find your perfect match across India's diverse regions
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {states.map((state, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStateClick(state)}
                    className="bg-white px-6 py-3 rounded-full text-gray-800 font-medium shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-red-50 hover:text-red-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    {state.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <Disclaimer />
          </section>
        </main>

        <section>
          <PhoneIcon />
        </section>

        <section>
          <WhatsAppIcon />
        </section>
      </div>
      <Footer />
    </>
  );
}
