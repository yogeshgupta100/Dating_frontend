import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for your website
const BASE_URL = "https://pokkoo.in";

// Common cities/states for your service with SEO-friendly slugs
const LOCATIONS = [
  { name: "Jaipur", slug: "jaipur" },
  { name: "Delhi", slug: "delhi" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Bangalore", slug: "bangalore" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Chennai", slug: "chennai" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Pune", slug: "pune" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Surat", slug: "surat" },
  { name: "Lucknow", slug: "lucknow" },
  { name: "Kanpur", slug: "kanpur" },
  { name: "Nagpur", slug: "nagpur" },
  { name: "Indore", slug: "indore" },
  { name: "Thane", slug: "thane" },
  { name: "Bhopal", slug: "bhopal" },
  { name: "Visakhapatnam", slug: "visakhapatnam" },
  { name: "Patna", slug: "patna" },
  { name: "Vadodara", slug: "vadodara" },
  { name: "Ghaziabad", slug: "ghaziabad" },
];

// Generate sitemap XML
function generateSitemap() {
  const currentDate = new Date().toISOString().split("T")[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Add location profile pages
  LOCATIONS.forEach((location) => {
    sitemap += `
  
  <!-- ${location.name} Profile Pages -->
  <url>
    <loc>${BASE_URL}/${location.slug}/profiles</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Add individual profile pages (example slugs for each location)
    for (let i = 1; i <= 10; i++) {
      const profileSlug = `escort-${location.slug}-${i}`;
      sitemap += `
  
  <url>
    <loc>${BASE_URL}/${location.slug}/profiles/${profileSlug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }
  });

  // Add important static pages
  sitemap += `
  
  <!-- Important Static Pages -->
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <!-- Admin Routes (Note: These are protected but included for completeness) -->
  <url>
    <loc>${BASE_URL}/admin</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/admin/locations</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/admin/models</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/admin/faqs</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
  
</urlset>`;

  return sitemap;
}

// Write sitemap to public directory
const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
const sitemapContent = generateSitemap();

fs.writeFileSync(sitemapPath, sitemapContent);
console.log("✅ Sitemap generated successfully at:", sitemapPath);
console.log("📊 Total URLs generated:", 1 + LOCATIONS.length * 11 + 4 + 4); // homepage + (locations * 11) + static pages + admin pages
