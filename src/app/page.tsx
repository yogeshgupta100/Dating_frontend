import { Metadata } from "next";
import HomePageClient from "../components/HomePageClient";
import SEO from "../components/SEO";

// Server-side metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Call Girls and Escort Service Adult meetings in India - Pokkoo",
    description:
      "Pokkoo.in is India & No.1 ads posting site for Independent call girl and escort services in India. Browse our categories to book an call girl available 24/7 and get sex dating in India Post your ads.",
    keywords:
      "call girl, call girls, call girl service, call girls service, escort service, escorts service, pokkoo, cash payment, call girl near me, call girl whatsapp number, call girl contact number",
    openGraph: {
      title: "Call Girls and Escort Service Adult meetings in India - Pokkoo",
      description:
        "Pokkoo.in is India & No.1 ads posting site for Independent call girl and escort services in India. Browse our categories to book an call girl available 24/7 and get sex dating in India Post your ads.",
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
    name: "Call Girls and Escort Service Adult meetings in India - Pokkoo",
    description:
      "Pokkoo.in is India & No.1 ads posting site for Independent call girl and escort services in India. Browse our categories to book an call girl available 24/7 and get sex dating in India Post your ads.",
    url: "https://pokkoo.in",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Call Girls and Escort Service Adult meetings in India - Pokkoo",
      description:
        "Pokkoo.in is India & No.1 ads posting site for Independent call girl and escort services in India. Browse our categories to book an call girl available 24/7 and get sex dating in India Post your ads.",
      url: "https://pokkoo.in",
      address: {
        "@type": "PostalAddress",
        addressLocality: "India",
        addressRegion: "India",
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
      areaServed: "India",
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
        title="Call Girls and Escort Service Adult meetings in India - Pokkoo"
        description="Pokkoo.in is India & No.1 ads posting site for Independent call girl and escort services in India. Browse our categories to book an call girl available 24/7 and get sex dating in India Post your ads."
        keywords="call girl, call girls, call girl service, call girls service, escort service, escorts service, pokkoo, cash payment, call girl near me, call girl whatsapp number, call girl contact number"
        url="https://pokkoo.in"
        structuredData={homePageStructuredData}
        pathname="/"
        canonical="https://pokkoo.in"
      />
      <HomePageClient />
    </>
  );
}
