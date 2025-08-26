import { Metadata } from "next";
import { slugToText } from "../../../utils/slug";
import { getLocations } from "../../../services/Locations";
import {
  getModels,
  getProfileBySlug,
  getProfile,
} from "../../../services/models";
import { getLocationBySlug } from "../../../services/Locations";
import { renderHtmlContent } from "../../../utils/htmlUtils";
import {
  STATIC_SERVICES,
  SERVICE_CATEGORIES,
} from "../../../constants/services";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Disclaimer from "../../../components/Disclaimer";
import ProfileHero from "../../../components/ProfileHero";
import WhatsAppIcon from "../../../components/WhatsAppIcon";
import PhoneIcon from "../../../components/PhoneIcon";
import { CheckCircle, Heart, Star, Sparkles } from "lucide-react";
import banner_img from "../../../../public/banner_img.jpeg";
import GoBackButton from "../../../components/GoBackButton";

// Generate static params for all location-model combinations
export async function generateStaticParams() {
  try {
    const locations = await getLocations();
    const params: { locationSlug: string; modelSlug: string }[] = [];

    for (const location of locations) {
      try {
        const models = await getModels(location.id.toString());
        for (const model of models) {
          params.push({
            locationSlug: location.slug || location.id.toString(),
            modelSlug: model.slug || model.id.toString(),
          });
        }
      } catch (error) {
        console.error(
          `Error fetching models for location ${location.name}:`,
          error
        );
      }
    }

    return params;
  } catch (error) {
    console.error("Error generating static params for models:", error);
    // Return some default combinations as fallback
    return [
      { locationSlug: "Pokkoo", modelSlug: "model-1" },
      { locationSlug: "mumbai", modelSlug: "model-2" },
      { locationSlug: "delhi", modelSlug: "model-3" },
    ];
  }
}

// Server-side metadata generation
export async function generateMetadata({
  params,
}: {
  params: { locationSlug: string; modelSlug: string };
}): Promise<Metadata> {
  try {
    // Fetch location data
    const location = await getLocationBySlug(params.locationSlug);

    // Fetch model data by slug
    const model = await getProfileBySlug(params.modelSlug);

    if (!model) {
      return {
        title: "Profile Not Found",
        description: "The requested profile could not be found.",
      };
    }

    const locationName =
      location?.name || slugToText(params.locationSlug) || "Pokkoo";
    const profileName =
      model.name || slugToText(params.modelSlug) || "Escort Profile";

    // Use dynamic SEO data from API if available, otherwise fallback to generated content
    const pageTitle =
      model.seo_title ||
      `${profileName} - Premium Escort Service in ${locationName}`;
    const pageDescription =
      model.seo_desc ||
      `Premium escort service featuring ${profileName} in ${locationName}. Safe, discreet, and professional escort services with verified profiles.`;
    const pageKeywords =
      model.seo_keywords ||
      `${profileName}, ${locationName} escorts, call girls ${locationName}, escort service ${locationName}, verified escorts, premium call girls`;

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `https://pokkoo.in/${params.locationSlug}/${params.modelSlug}`,
        siteName: "Pokkoo Escorts Service",
        images: [
          {
            url:
              model.profile_img && typeof model.profile_img === "string"
                ? model.profile_img
                : "https://pokkoo.in/og-image.jpg",
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
        images: [
          model.profile_img && typeof model.profile_img === "string"
            ? model.profile_img
            : "https://pokkoo.in/og-image.jpg",
        ],
      },
      alternates: {
        canonical: `https://pokkoo.in/${params.locationSlug}/${params.modelSlug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Model Profile",
      description: "Premium escort services",
    };
  }
}

export default async function ModelPage({
  params,
}: {
  params: { locationSlug: string; modelSlug: string };
}) {
  // Fetch data server-side
  let profile: any = null;
  let location: any = null;

  try {
    // Fetch model data by slug
    profile = await getProfileBySlug(params.modelSlug);

    // If slug fetch fails, try to extract ID from slug and fetch by ID
    if (!profile && params.modelSlug) {
      const idMatch = params.modelSlug.match(/(\d+)$/);
      if (idMatch) {
        const extractedId = idMatch[1];
        try {
          profile = await getProfile(extractedId);
        } catch (idError) {
          console.log("ID fetch also failed:", idError);
        }
      }
    }

    // Fetch location data for phone number fallback
    try {
      location = await getLocationBySlug(params.locationSlug);
    } catch (locationError) {
      console.error("Error fetching location:", locationError);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-sm">
            <p className="text-red-600 text-lg mb-4">Profile not found</p>
            <GoBackButton />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const profileName =
    profile?.name ||
    profile?.heading ||
    slugToText(params.modelSlug || "") ||
    "Escort Profile";
  const locationName = slugToText(params.locationSlug || "") || "Pokkoo";

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
                src={(profile?.profile_img as any) ?? "/default-profile.jpg"}
                alt={(profile?.name as any) ?? "Profile"}
                className="w-full h-full rounded-xl object-cover shadow-lg bg-white"
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
                number={profile?.phone_number || location?.phone_number || ""}
              />
            </section>
            <section className="flex-1 md:flex-none">
              <WhatsAppIcon
                number={profile?.phone_number || location?.phone_number || ""}
              />
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
