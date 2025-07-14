import { Metadata } from "next";
import ModelPageClient from "../../../components/ModelPageClient";
import { slugToText } from "../../../utils/slug";
import { getLocations } from "../../../services/Locations";
import { getModels, getProfileBySlug } from "../../../services/models";
import { getLocationBySlug } from "../../../services/Locations";

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

export default function ModelPage() {
  return <ModelPageClient />;
}
