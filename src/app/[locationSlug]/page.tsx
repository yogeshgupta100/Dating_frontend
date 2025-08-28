import { Metadata } from "next";
import {
  slugToText,
  generatePageTitle,
  generateMetaDescription,
  generateKeywords,
} from "../../utils/slug";
import {
  getLocationBySlug,
  getLocationById,
  getLocations,
} from "../../services/Locations";
import { getModels } from "../../services/models";
import { renderHtmlContent } from "../../utils/htmlUtils";
import { generateProfileSlug } from "../../utils/slug";
import { clearLocationCache } from "../../services/Locations";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BannerWrapper from "../../components/BannerWrapper";
import ProfileCardWrapper from "../../components/ProfileCardWrapper";
import Disclaimer from "../../components/Disclaimer";
import WhatsAppIcon from "../../components/WhatsAppIcon";
import PhoneIcon from "../../components/PhoneIcon";
import { VerifiedSection } from "../../components/VerifiedSection";
import Gallery from "../../components/Gallery";
import CarCarouselWrapper from "../../components/CarCarouselWrapper";
import FAQSection from "../../components/FAQSection";

// Enable dynamic rendering for this page
export const dynamic = "force-dynamic";

// Server-side metadata generation
export async function generateMetadata({
  params,
}: {
  params: { locationSlug: string };
}): Promise<Metadata> {
  try {
    console.log("Generating metadata for slug:", params.locationSlug);

    // Fetch location data
    let location: any = null;
    try {
      location = await getLocationBySlug(params.locationSlug);
      console.log("Location for metadata:", location ? "found" : "not found");
    } catch (error) {
      console.error("Error fetching location for metadata:", error);
      location = null;
    }

    if (!location) {
      console.log("No location found, using fallback metadata");
      return {
        title: "Location Not Found",
        description: "The requested location could not be found.",
      };
    }

    const locationName =
      location.name || slugToText(params.locationSlug) || "Pokkoo";
    const pageTitle =
      location.seo_title ||
      `${locationName} Escorts - Premium Call Girls Service`;
    const pageDescription =
      location.seo_desc ||
      `Premium ${locationName} escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in ${locationName}.`;
    const pageKeywords =
      location.seo_keyword ||
      `${locationName} escorts, call girls ${locationName}, escort service ${locationName}, ${locationName} call girls, premium escorts ${locationName}, verified escorts ${locationName}`;

    console.log("Generated metadata for:", locationName, {
      title: pageTitle,
      description: pageDescription,
      seo_title: location.seo_title,
      seo_desc: location.seo_desc,
    });

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `https://pokkoo.in/${params.locationSlug}`,
        siteName: "Pokkoo Escorts Service",
        images: [
          {
            url: "https://pokkoo.in/og-image.jpg",
            width: 1200,
            height: 630,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: ["https://pokkoo.in/og-image.jpg"],
      },
      alternates: {
        canonical: `https://pokkoo.in/${params.locationSlug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Location Page",
      description: "Premium escort services",
    };
  }
}

export default async function LocationPage({
  params,
}: {
  params: { locationSlug: string };
}) {
  // Fetch data server-side with comprehensive error handling
  let location: any = null;
  let profiles: any[] = [];

  try {
    console.log("Starting location page for slug:", params.locationSlug);

    // Clear cache to ensure fresh data
    try {
      clearLocationCache(params.locationSlug);
      console.log("Cache cleared for slug:", params.locationSlug);
    } catch (cacheError) {
      console.error("Error clearing cache:", cacheError);
    }

    // First try to get location by slug with force refresh
    try {
      location = await getLocationBySlug(params.locationSlug, true);
      console.log(
        "Location fetched by slug:",
        location ? "success" : "not found"
      );
    } catch (slugError) {
      console.error("Error fetching location by slug:", slugError);
      location = null;
    }

    // If not found by slug, try to get by ID (fallback)
    if (!location) {
      try {
        location = await getLocationById(params.locationSlug);
        console.log(
          "Location fetched by ID:",
          location ? "success" : "not found"
        );
      } catch (idError) {
        console.error("Error fetching location by ID:", idError);
        location = null;
      }
    }

    if (location) {
      console.log("Location found:", {
        id: location.id,
        name: location.name,
        phone_number: location.phone_number,
        hasHeading: !!location.heading,
        hasContent: !!location.content,
      });

      // Fetch profiles for this location
      try {
        profiles = await getModels(location.id.toString());
        console.log("Profiles fetched:", profiles.length);
      } catch (profileError) {
        console.error("Error fetching profiles:", profileError);
        profiles = [];
      }
    } else {
      console.log("No location found for slug:", params.locationSlug);
    }
  } catch (error) {
    console.error("Critical error in LocationPage:", error);
    // Continue with empty data instead of throwing
  }

  const formatLocationName = (locationName: string | undefined) => {
    if (!locationName) return "Featured Profiles";
    return locationName.charAt(0).toUpperCase() + locationName.slice(1);
  };

  const locationName = formatLocationName(
    location?.name || slugToText(params.locationSlug || "")
  );

  const galleryImages = [
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050380/dating-app/banners/fefp5wju9louqsqy9j2d.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/profiles/byl4mt7g46ewv6jzoe87.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050459/dating-app/banners/az09b062duh3bceedxzl.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050513/dating-app/banners/skse6swh4lklbzigazx9.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050458/dating-app/profiles/fgsym9bjyi9mxxumhpje.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050379/dating-app/profiles/sjinrqpbizy9qdri4kqz.jpg",
  ];

  // Dynamic FAQ content using location name from API
  const faqs = [
    {
      question: `How to find call girl in ${location?.faq || locationName}?`,
      answer: `To get the top call girls in ${
        location?.faq || locationName
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

  console.log("Rendering location page with data:", {
    hasLocation: !!location,
    profilesCount: profiles.length,
    locationName,
    phoneNumber: location?.phone_number,
  });

  // Fallback content if no location data is available
  if (!location) {
    console.log("Rendering fallback page due to no location data");
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <BannerWrapper />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">
                {locationName} Escorts Service
              </h1>
              <p className="text-lg text-gray-600">
                Premium escort services in {locationName}. Safe, discreet, and
                professional.
              </p>
            </div>
            <Gallery showHeading={false} />
            <div className="max-w-6xl mx-auto">
              <Disclaimer />
            </div>
          </div>
          <section>
            <PhoneIcon number={undefined} />
          </section>
          <section>
            <WhatsAppIcon number={undefined} />
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <BannerWrapper />

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
              <ProfileCardWrapper
                key={profile.id}
                profile={profile}
                locationSlug={params.locationSlug}
                allProfiles={profiles}
                locationName={location?.name}
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

          <FAQSection
            faqs={faqs}
            locationName={location?.faq || locationName}
          />

          <VerifiedSection />

          <section className="mb-20">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Success Stories Gallery
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Celebrating the beautiful connections made through our{" "}
                {location?.faq || locationName} platform.
              </p>
            </div>
            <CarCarouselWrapper images={galleryImages} />
          </section>

          <div className="max-w-6xl mx-auto">
            <Disclaimer />
          </div>
        </div>

        <section>
          <PhoneIcon
            number={
              location?.phone_number && location.phone_number !== "00000000"
                ? location.phone_number
                : undefined
            }
          />
        </section>

        <section>
          <WhatsAppIcon
            number={
              location?.phone_number && location.phone_number !== "00000000"
                ? location.phone_number
                : undefined
            }
          />
        </section>
      </div>
      <Footer />
    </>
  );
}
