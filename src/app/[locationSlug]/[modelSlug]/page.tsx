import { Metadata } from "next";
import { slugToText } from "../../../utils/slug";
import ModelPageClient from "../../../components/ModelPageClient";

// Enable dynamic rendering for this page to avoid static generation issues
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Disable generateStaticParams to prevent build-time data fetching
// This route is fully dynamic and will fetch data at request time

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
