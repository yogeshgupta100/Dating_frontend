import { Metadata } from "next";
import LocationPageClient from "../../components/LocationPageClient";
import SEO from "../../components/SEO";
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
import { LocationResponse } from "../../services";

// Enable dynamic rendering for this page
export const dynamic = "force-dynamic";

// Server-side metadata generation
export async function generateMetadata({
  params,
}: {
  params: { locationSlug: string };
}): Promise<Metadata> {
  try {
    const location = await getLocationBySlug(params.locationSlug);

    if (!location) {
      return {
        title: "Location Not Found",
        description: "The requested location could not be found.",
      };
    }

    const locationName = location.name;
    const pageTitle =
      location.seo_title ||
      `${locationName} Escorts - Premium Call Girls Service`;
    const pageDescription =
      location.seo_desc ||
      `Premium ${locationName} escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in ${locationName}.`;
    const pageKeywords =
      location.seo_keyword ||
      `${locationName} escorts, call girls ${locationName}, escort service ${locationName}, ${locationName} call girls, premium escorts ${locationName}, verified escorts ${locationName}`;

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
  // Pre-fetch location data for better SEO and faster initial load
  let location: LocationResponse | null = null;

  console.log(
    "LocationPage: Starting server-side fetch for slug:",
    params.locationSlug
  );

  try {
    console.log(
      "LocationPage: Fetching location by slug:",
      params.locationSlug
    );
    // Force refresh to ensure we get fresh data
    location = await getLocationBySlug(params.locationSlug, true);

    if (!location) {
      console.log(
        "LocationPage: Location not found by slug, trying by ID:",
        params.locationSlug
      );
      location = await getLocationById(params.locationSlug);
    }

    if (location) {
      console.log("LocationPage: Location data fetched successfully:", {
        id: location.id,
        name: location.name,
        slug: location.slug,
      });
    } else {
      console.log(
        "LocationPage: No location data found for slug:",
        params.locationSlug
      );
    }
  } catch (error) {
    console.error("LocationPage: Error fetching location data:", error);
    // Don't fail the page if server-side fetch fails, let client-side handle it
  }

  // Always render the client component, even if server-side fetch failed
  // The client component will handle fetching the data if initialLocation is null
  return <LocationPageClient initialLocation={location} />;
}
