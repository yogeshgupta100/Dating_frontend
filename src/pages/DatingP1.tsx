import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCarousel from "../components/CarCarousel";
import { Play, Users, MapPin, Shield } from "lucide-react";
import Disclaimer from "../components/Disclaimer";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { LocationResponse } from "../services";
import PhoneIcon from "../components/PhoneIcon";
import { getLocations } from "../services/Locations";
import { Banner } from "../components/Banner";
import {api} from "../services/api";
import SEO from "../components/SEO";
import { generateSlug, generateUniqueSlug } from "../utils/slug";

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

const DatingP1 = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState<LocationResponse[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleStateClick = (location: LocationResponse) => {
    // Use slug if available, otherwise generate one from name
    const slug = location.slug || generateUniqueSlug(location.name, states.map(s => s.slug).filter(Boolean));
    navigate(`${slug}`, { state: { id: location.id } });
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

  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Jaipur Escorts Service - Premium Call Girls with Cash Payment & Free Delivery",
    "description": "Premium Jaipur escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Jaipur.",
    "url": "https://pro.abellarora.com",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Jaipur Escorts Service",
      "description": "Premium Jaipur escorts service offering verified call girls with cash payment and free door delivery 24/7.",
      "url": "https://pro.abellarora.com",
      "telephone": "+91-XXXXXXXXXX",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jaipur",
        "addressRegion": "Rajasthan",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "26.9124",
        "longitude": "75.7873"
      },
      "openingHours": "Mo-Su 00:00-23:59",
      "priceRange": "₹₹",
      "serviceType": "Escort Service",
      "areaServed": "Jaipur",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Escort Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Premium Escort Service",
              "description": "Verified call girls with cash payment and free delivery"
            }
          }
        ]
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
        }
      ]
    }
  };

  return (
    <>
      <SEO 
        title="Jaipur Escorts Service - Premium Call Girls with Cash Payment & Free Delivery"
        description="Premium Jaipur escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Jaipur."
        keywords="Jaipur escorts, call girls Jaipur, escort service Jaipur, Jaipur call girls, premium escorts Jaipur, verified escorts Jaipur, cash payment escorts, free delivery escorts"
        url="https://pro.abellarora.com"
        structuredData={homePageStructuredData}
      />
      <div className="min-h-screen bg-gray-50">
        <Banner />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Jaipur Escorts Service offers Cash Payment & Free Delivery
              </h1>
              <div className="max-w-5xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Jaipur escorts service presents safe escort girls to fulfill
                  your sexual needs at only rate 4500/- with cash payment and free
                  door delivery 24/7. Life in Jaipur is hectic and there's no
                  escaping in today's life. It's the sex life that has suffered
                  the most due to this. Jaipur escorts have done a great job in
                  not just fulfilling your sexual desires but in pleasing your
                  senses as well. All your physical needs will be fulfilled by
                  some of the hottest girls in town who are provided by Jaipur
                  Escort. From college girls, models, actresses, housewives, and
                  MLFs, to Independent Call Girls in Jaipur are all available with
                  them. The escort agencies also have girls from all Indian states
                  and some imports as well. The hot Russian beauties are also
                  provided by them. These call girls are most fascinating,
                  exciting, lovable, and delightful. Jaipur is a business hub and
                  visitors come here not just for tourist trips but to bring back
                  their missing pieces in life. The pandemic has taught us that
                  life is uncertain and therefore hanging up won't be ideal.
                  Explore the this city's magic with ideal choices of girls that
                  can take you back in times. Not just Indian but Jaipur escorts
                  record the maximum number of foreign tourists in India. They
                  also crave for brown skin and as a reliable escort provider we
                  cater our services to them as well. The Jaipur Escort Agency has
                  made sure that they don't see the age, color, or caste of their
                  customers. The services are open for all and one doesn't have to
                  shy away from approaching us. We are available 24*7 and also
                  provide our services to all areas of the city.
                </p>
                {/* <p>{paragraph}</p> */}
              </div>
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
                    <h3 className="text-xl font-semibold mb-2">Verified Call Girls</h3>
                    <p className="text-gray-600">
                      Verified profiles across India
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
                    <p className="text-gray-600">Privacy and safety guaranteed</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Pan India</h3>
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
    </>
  );
};

export default DatingP1;
