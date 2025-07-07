import { Metadata } from "next";
import HomePageClient from "../components/HomePageClient";
import SEO from "../components/SEO";

// Server-side metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "Pokkoo Escorts Service - Premium Call Girls with Cash Payment & Free Delivery",
    description:
      "Premium Pokkoo escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Pokkoo.",
    keywords:
      "Pokkoo escorts, call girls Pokkoo, escort service Pokkoo, Pokkoo call girls, premium escorts Pokkoo, verified escorts Pokkoo, cash payment escorts, free delivery escorts",
    openGraph: {
      title:
        "Pokkoo Escorts Service - Premium Call Girls with Cash Payment & Free Delivery",
      description:
        "Premium Pokkoo escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Pokkoo.",
      url: "https://pokkoo.in",
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
      title:
        "Pokkoo Escorts Service - Premium Call Girls with Cash Payment & Free Delivery",
      description:
        "Premium Pokkoo escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Pokkoo.",
      images: ["https://pokkoo.in/og-image.jpg"],
    },
    alternates: {
      canonical: "https://pokkoo.in",
    },
  };
}

export default function HomePage() {
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pokkoo Escorts Service - Premium Call Girls with Cash Payment & Free Delivery",
    description:
      "Premium Pokkoo escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Pokkoo.",
    url: "https://pokkoo.in",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Pokkoo Escorts Service",
      description:
        "Premium Pokkoo escorts service offering verified call girls with cash payment and free door delivery 24/7.",
      url: "https://pokkoo.in",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pokkoo",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "26.9124",
        longitude: "75.7873",
      },
      openingHours: "Mo-Su 00:00-23:59",
      priceRange: "₹₹",
      serviceType: "Escort Service",
      areaServed: "Pokkoo",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Escort Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Premium Escort Service",
              description:
                "Verified call girls with cash payment and free delivery",
            },
          },
        ],
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://pokkoo.in",
        },
      ],
    },
  };

  return (
    <>
      <SEO
        title="Pokkoo Escorts Service - Premium Call Girls with Cash Payment & Free Delivery"
        description="Premium Pokkoo escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Pokkoo."
        keywords="Pokkoo escorts, call girls Pokkoo, escort service Pokkoo, Pokkoo call girls, premium escorts Pokkoo, verified escorts Pokkoo, cash payment escorts, free delivery escorts"
        url="https://pokkoo.in"
        structuredData={homePageStructuredData}
        pathname="/"
        canonical="https://pokkoo.in"
      />
      <HomePageClient />
    </>
  );
}
