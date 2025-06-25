import { Metadata } from 'next';
import ModelPageClient from "../../../components/ModelPageClient";
import { slugToText } from "../../../utils/slug";
import { getLocations } from "../../../services/Locations";
import { getModels } from "../../../services/models";

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
        console.error(`Error fetching models for location ${location.name}:`, error);
      }
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params for models:', error);
    // Return some default combinations as fallback
    return [
      { locationSlug: 'jaipur', modelSlug: 'model-1' },
      { locationSlug: 'mumbai', modelSlug: 'model-2' },
      { locationSlug: 'delhi', modelSlug: 'model-3' },
    ];
  }
}

// Server-side metadata generation
export async function generateMetadata({ params }: { params: { locationSlug: string; modelSlug: string } }): Promise<Metadata> {
  try {
    // Note: We can't access Zustand store on server side, so we'll generate basic metadata
    // The actual profile data will be loaded client-side
    const locationName = slugToText(params.locationSlug) || 'Jaipur';
    const profileName = slugToText(params.modelSlug) || 'Escort Profile';
    
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
        url: `https://pro.abellarora.com/${params.locationSlug}/${params.modelSlug}`,
        siteName: 'Jaipur Escorts Service',
        images: [
          {
            url: 'https://pro.abellarora.com/og-image.jpg',
            width: 1200,
            height: 630,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: ['https://pro.abellarora.com/og-image.jpg'],
      },
      alternates: {
        canonical: `https://pro.abellarora.com/${params.locationSlug}/${params.modelSlug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Model Profile',
      description: 'Premium escort services',
    };
  }
}

export default function ModelPage() {
  return <ModelPageClient />;
}
