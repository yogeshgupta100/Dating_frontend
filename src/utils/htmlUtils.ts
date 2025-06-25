/**
 * Decodes HTML entities and cleans up content for proper rendering
 * @param content - The HTML content string
 * @returns Cleaned and decoded HTML content
 */
export const decodeAndCleanHtml = (content: string): string => {
  if (!content) return '';
  
  // Use a simple regex to decode common HTML entities
  let decodedContent = content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove any double-wrapped <p> tags that might have been added accidentally
  decodedContent = decodedContent.replace(/<p>\s*<p>/g, '<p>');
  decodedContent = decodedContent.replace(/<\/p>\s*<\/p>/g, '</p>');
  
  // Clean up any extra whitespace
  decodedContent = decodedContent.trim();
  
  return decodedContent;
};

/**
 * Safely renders HTML content with proper decoding
 * @param content - The HTML content string
 * @returns Object for dangerouslySetInnerHTML
 */
export const renderHtmlContent = (content: string) => {
  const cleanedContent = decodeAndCleanHtml(content);
  return { __html: cleanedContent };
}; 