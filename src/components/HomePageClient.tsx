'use client';

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
import { renderHtmlContent } from '../utils/htmlUtils';

const carImages = [
  "http://res.cloudinary.com/dznqar2xr/image/upload/v1750583536/dating-app/profiles/toihekxceyx3wifjihg1.jpg",
  "http://res.cloudinary.com/dznqar2xr/image/upload/v1750583536/dating-app/profiles/toihekxceyx3wifjihg1.jpg",
  "http://res.cloudinary.com/dznqar2xr/image/upload/v1750583536/dating-app/profiles/toihekxceyx3wifjihg1.jpg",
  "http://res.cloudinary.com/dznqar2xr/image/upload/v1750583536/dating-app/profiles/toihekxceyx3wifjihg1.jpg",
  "http://res.cloudinary.com/dznqar2xr/image/upload/v1750583536/dating-app/profiles/toihekxceyx3wifjihg1.jpg",
];

const peopleImages = [
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=400",
];

const paragraph = `Building meaningful connections has never been more important in today's digital age. Our platform brings together like-minded individuals who are serious about finding genuine relationships. Through our advanced matching algorithm and personalized approach, we help create lasting bonds that go beyond surface-level attraction. Whether you're looking for companionship, friendship, or a life partner, we provide a safe and welcoming environment for authentic connections to flourish.`;

export default function HomePageClient() {
  const router = useRouter();
  const [states, setStates] = useState<LocationResponse[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleStateClick = (location: LocationResponse) => {
    // Use slug if available, otherwise generate one from name
    const slug = location.slug || generateUniqueSlug(location.name, states.map(s => s.slug).filter(Boolean));
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
    }
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
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Delhi Escorts Service offers Cash Payment & Free Delivery
              </h1>
              <div
                className="max-w-5xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed location-content"
                dangerouslySetInnerHTML={renderHtmlContent(paragraph || "")}
              />
            </div>
          </section>

          {/* Car Carousel Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                100% Real Models
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the finer things in life with like-minded individuals
                who share your passion for excellence.
              </p>
            </div>
            <CarCarousel images={carImages} />
          </section>

          {/* About Us Section */}
          <section id="about" className="mb-20">
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  About Us
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-black mb-2">Verified Call Girls</h3>
                    <p className="text-gray-600">
                      Verified profiles across India
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-black mb-2">100% Secure</h3>
                    <p className="text-gray-600">Privacy and safety guaranteed</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-black mb-2">Pan India</h3>
                    <p className="text-gray-600">Coverage across all states</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>{paragraph}</p>
                <p>{paragraph}</p>
                <p>{paragraph}</p>
              </div>
            </div>
          </section>

          {/* People Gallery */}
          <section id="gallery" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Amazing People
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with genuine individuals who are ready for meaningful
                relationships.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {peopleImages.map((src, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={src}
                    alt={`Person ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* States Coverage */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  States We Cover
                </h2>
                <p className="text-lg text-gray-600">
                  Find your perfect match across India's diverse regions
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {states.map((state, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleStateClick(state)
                    }
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