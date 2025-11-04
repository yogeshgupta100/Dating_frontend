import { Metadata } from "next";
import { slugToText } from "../../../utils/slug";
import { getLocations } from "../../../services/Locations";
import {
  getModels,
  getProfileBySlug,
  getProfile,
} from "../../../services/models";
import { getLocationBySlug } from "../../../services/Locations";
import ModelPageClient from "../../../components/ModelPageClient";

// Enable dynamic rendering for this page to avoid static generation issues
export const dynamic = "force-dynamic";

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

// Server-side metadata generation - simplified to avoid API calls
export async function generateMetadata({
  params,
}: {
  params: { locationSlug: string; modelSlug: string };
}): Promise<Metadata> {
  const locationName = slugToText(params.locationSlug) || "Pokkoo";
  const profileName = slugToText(params.modelSlug) || "Escort Profile";

  const pageTitle = `${profileName} - Premium Escort Service in ${locationName}`;
  const pageDescription = `Premium escort service featuring ${profileName} in ${locationName}. Safe, discreet, and professional escort services with verified profiles.`;
  const pageKeywords = `${profileName}, ${locationName} escorts, call girls ${locationName}, escort service ${locationName}, verified escorts, premium call girls`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://pokkoo.co.in/${params.locationSlug}/${params.modelSlug}`,
      siteName: "Pokkoo Escorts Service",
      images: [
        {
          url: "https://pokkoo.co.in/og-image.jpg",
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
      images: ["https://pokkoo.co.in/og-image.jpg"],
    },
    alternates: {
      canonical: `https://pokkoo.co.in/${params.locationSlug}/${params.modelSlug}`,
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: { locationSlug: string; modelSlug: string };
}) {
  // For RSC requests, don't fetch data server-side to avoid delays
  // Let the client component handle data fetching
  return (
    <ModelPageClient
      profile={null}
      location={null}
      locationSlug={params.locationSlug}
      modelSlug={params.modelSlug}
    />
  );
}
