import { Metadata } from "next";
import LocationPageClient from "../../components/LocationPageClient";
import { getLocationBySlug, getLocationById } from "../../services/Locations";
import { LocationResponse } from "../../services";

// Force fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🔑 Shared fetch function
async function fetchLocation(slug: string): Promise<LocationResponse | null> {
  let location = await getLocationBySlug(slug, true);

  if (!location) {
    location = await getLocationById(slug);
  }

  return location;
}

// Server-side metadata generation
export async function generateMetadata({
  params,
}: {
  params: { locationSlug: string };
}): Promise<Metadata> {
  try {
    const location = await fetchLocation(params.locationSlug);

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
  const location = await fetchLocation(params.locationSlug);

  return <LocationPageClient initialLocation={location} />;
}
