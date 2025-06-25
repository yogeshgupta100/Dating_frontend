// Slug utility functions for SEO-friendly URLs

/**
 * Convert text to SEO-friendly slug
 * @param text - The text to convert to slug
 * @returns SEO-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate unique slug by appending number if slug already exists
 * @param text - The text to convert to slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique SEO-friendly slug
 */
export const generateUniqueSlug = (text: string, existingSlugs: string[]): string => {
  let slug = generateSlug(text);
  let counter = 1;
  let uniqueSlug = slug;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

/**
 * Generate unique profile slug that's different from location slugs
 * @param profileName - The profile name
 * @param locationSlug - The location slug to avoid conflicts
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique profile slug
 */
export const generateProfileSlug = (profileName: string, locationSlug: string, existingSlugs: string[]): string => {
  // Generate base slug from profile name
  let baseSlug = generateSlug(profileName);
  
  // If the base slug is the same as location slug, add a prefix
  if (baseSlug === locationSlug) {
    baseSlug = `escort-${baseSlug}`;
  }
  
  // If still conflicts, add more context
  if (existingSlugs.includes(baseSlug) || baseSlug === locationSlug) {
    baseSlug = `call-girl-${generateSlug(profileName)}`;
  }
  
  // If still conflicts, add a number
  let finalSlug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(finalSlug) || finalSlug === locationSlug) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return finalSlug;
};

/**
 * Validate if a slug is valid
 * @param slug - The slug to validate
 * @returns True if slug is valid
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
};

/**
 * Extract slug from URL path
 * @param path - The URL path
 * @returns The slug from the path
 */
export const extractSlugFromPath = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
};

/**
 * Generate slug suggestions based on text
 * @param text - The text to generate suggestions for
 * @param existingSlugs - Array of existing slugs
 * @returns Array of slug suggestions
 */
export const generateSlugSuggestions = (text: string, existingSlugs: string[]): string[] => {
  const baseSlug = generateSlug(text);
  const suggestions = [baseSlug];

  // Add variations
  const variations = [
    text.replace(/\s+/g, '-'),
    text.replace(/\s+/g, '_'),
    text.toLowerCase().replace(/\s+/g, '-'),
    text.toLowerCase().replace(/\s+/g, '_')
  ];

  variations.forEach(variation => {
    const slug = generateSlug(variation);
    if (slug !== baseSlug && !suggestions.includes(slug)) {
      suggestions.push(slug);
    }
  });

  // Add numbered variations for uniqueness
  let counter = 1;
  while (suggestions.length < 5) {
    const numberedSlug = `${baseSlug}-${counter}`;
    if (!existingSlugs.includes(numberedSlug)) {
      suggestions.push(numberedSlug);
    }
    counter++;
  }

  return suggestions.slice(0, 5);
};

/**
 * Convert slug back to readable text
 * @param slug - The slug to convert
 * @returns Readable text
 */
export const slugToText = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Generate meta description from slug and content
 * @param slug - The slug
 * @param content - The content
 * @returns SEO-friendly meta description
 */
export const generateMetaDescription = (slug: string, content: string): string => {
  const locationName = slugToText(slug);
  const baseDescription = `Premium ${locationName} escorts service offering verified call girls with cash payment and free door delivery 24/7. Safe, discreet, and professional escort services in ${locationName}.`;
  
  // If content is provided, use it to enhance description
  if (content && content.length > 50) {
    const contentPreview = content.substring(0, 100).replace(/<[^>]*>/g, '');
    return `${baseDescription} ${contentPreview}...`;
  }
  
  return baseDescription;
};

/**
 * Generate page title from slug
 * @param slug - The slug
 * @returns SEO-friendly page title
 */
export const generatePageTitle = (slug: string): string => {
  const locationName = slugToText(slug);
  return `${locationName} Escorts Service - Premium Call Girls with Cash Payment & Free Delivery`;
};

/**
 * Generate keywords from slug
 * @param slug - The slug
 * @returns SEO-friendly keywords
 */
export const generateKeywords = (slug: string): string => {
  const locationName = slugToText(slug);
  return `${locationName} escorts, call girls ${locationName}, escort service ${locationName}, ${locationName} call girls, premium escorts ${locationName}, verified escorts ${locationName}, cash payment escorts, free delivery escorts`;
}; 