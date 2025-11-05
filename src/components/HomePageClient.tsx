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
  "https://res.cloudinary.com/dpmknwklm/image/upload/v1751050380/dating-app/banners/fefp5wju9louqsqy9j2d.jpg",
  "https://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/profiles/byl4mt7g46ewv6jzoe87.jpg",
  "https://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/banners/skse6swh4lklbzigazx9.jpg",
  "https://res.cloudinary.com/dpmknwklm/image/upload/v1751050458/dating-app/profiles/fgsym9bjyi9mxxumhpje.jpg",
  "https://res.cloudinary.com/dpmknwklm/image/upload/v1751050379/dating-app/profiles/sjinrqpbizy9qdri4kqz.jpg",
];

const paragraph = `Thank you for taking time to learn a bit better. Contact Pokkoo call girls services only for real parson, We have Girls for B2B Enjoy Naked Sex And Whatspects; Spa Shower Bath Sexy Gals Only by Aromatherapy, Spa, Happy Ending Massage, Nude B2B Massage Rain Bath Tantric Massage BDSM Candle Massage Bubb sucking, licking, blowing work, call and out call feature 3 by beautiful and sexy girls with 5-star Hotel and Home Services are also available. Economical Rate, 100% Satisfaction. Visit Here for Pokkoo Call Girls 24x7 Services! Quick Contact Us`;

const aboutUsContent = `
<h3>Most Fulfilling Premium Escort Service in Your City - Free Adult Website Ads in India</h3>
<p>Find your dream date or intimacy partner from Pokkoo- the leading high-class call girls and escorts free website ads in India. Enjoy premium VIP escort services in your city with elite and experienced call girls of your choice. Satiate your lust and erotic fantasies with hot girls.</p>
<h3>A Trusted Brand Offering Massage Services Of Sexy Female Escorts</h3>
<p>Enjoy excellent whole-body massage from experienced masseuses and sizzling massage girls. Locate the hottest girls of your choice from the adult website ads to book a massage session. Gain maximum sensual benefits from excellent erotic massages.</p>
<h3>Young Virgin Call Girls Post Ads On Pokkoo Escorts & Call Girls Website</h3>
<p>Best website portal for young virgin call girls who post ads offering services of massage and dating. Experience mind-blowing pleasure from virgin escort girls with the hottest intimate sessions. Release stress and escape boredom. Book your favourite unmarried sexy hottie seamlessly from the trusted brand.</p>
<h3>Live Sex Cam Model Girls - Trusted Website Ads</h3>
<p>Enjoy sex chat and video calling with the hot naked girls for a blast of fun. Your search for sexy models for private chat and live shows ends here. Skip boredom and experience sensual fulfilment with glamorous model girls providing VIP escort services to pleasure seekers.</p>
<h3>Adult Meetings Websites in All Location Nearby</h3>
<p>Meet your dream date for a romantic evening or an unforgettable nightout. Enjoy the company of hot models, women, call girls and elite celebrities in your city on one platform.</p>
<p>Experience the fun of sharing and emotional fulfilment in any category of escorts and call girls you may be looking for. Browse various free website ads to find your sexy partner for the Girlfriend experience, bar hopping and casual hookup with the best adult meetings ads.</p>
<p>Welcome to Pokkoo- your most reliable entertainment partner for escort service Free Website ads in India. If you want to savour excellent and fulfilling escort services from hot and lustful girls, rely on our website.</p>
<p>Herein, you will find adult ads for massages, high-class call girls, Russian models, young virgin call girls, live sex cam model girls and adult meetings. Check out all categories to book your choicest sexy partner in your preferred category. Experience the ultimate adult entertainment.</p>
<p>Looking for sex chat and video calling to release stress and sexual frustration? Pokkoo has ads for model girls in Delhi, Mumbai, Bangalore, Kolkata or any city in India for live sex cam. Interested adult entertainers and professional pleasure givers can post their website ads absolutely FREE!</p>
`;

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
        <main
          id="home"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          {/* Introduction */}
          <section className="mb-20">
            <div className="mb-12 location-content flex flex-col">
              <h1 className="mb-6 w-full text-center md:text-center lg:text-center">
                Call Girls Service and Adult meetings in India - Pokkoo
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
              {/* <h2 className="mb-6">About Us</h2> */}
              {/* </div> */}
              <div
                className="space-y-6 leading-relaxed location-content"
                dangerouslySetInnerHTML={renderHtmlContent(aboutUsContent)}
              />
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
