import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  structuredData?: object;
  canonical?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  pathname?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Jaipur Escorts Service - Premium Call Girls with Cash Payment & Free Delivery",
  description = "Premium Jaipur escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in Jaipur.",
  keywords = "Jaipur escorts, call girls Jaipur, escort service Jaipur, Jaipur call girls, premium escorts Jaipur, verified escorts Jaipur",
  image = "https://pro.abellarora.com/og-image.jpg",
  url = "https://pro.abellarora.com",
  type = "website",
  structuredData,
  canonical,
  breadcrumbs = [],
  pathname = "",
}) => {
  const currentUrl = canonical || `https://pro.abellarora.com${pathname}`;

  console.log(
    title,
    description,
    keywords,
    image,
    url,
    type,
    structuredData,
    canonical,
    breadcrumbs,
    pathname
  );

  // Generate breadcrumb structured data
  const generateBreadcrumbData = () => {
    if (breadcrumbs.length === 0) {
      // Auto-generate breadcrumbs from URL
      const pathSegments = pathname.split("/").filter(Boolean);
      const autoBreadcrumbs = [
        { name: "Home", url: "https://pro.abellarora.com/" },
      ];

      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1);
        autoBreadcrumbs.push({
          name: name,
          url: `https://pro.abellarora.com${currentPath}`,
        });
      });

      return autoBreadcrumbs;
    }
    return breadcrumbs;
  };

  const breadcrumbData = generateBreadcrumbData();

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: currentUrl,
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Jaipur Escorts Service",
      description: description,
      url: url,
      telephone: "+91-XXXXXXXXXX",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jaipur",
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
      areaServed: "Jaipur",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbData.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="https://www.pokkoo.in" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Jaipur Escorts Service" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData),
        }}
      />
    </Head>
  );
};

export default SEO;
