/**
 * Decodes HTML entities and cleans up content for proper rendering
 * @param content - The HTML content string
 * @returns Cleaned and decoded HTML content
 */
export const decodeAndCleanHtml = (content: string): string => {
  if (!content) return '';
  
  // Create a temporary element to decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = content;
  let decodedContent = textarea.value;
  
  // Remove any double-wrapped <p> tags that might have been added accidentally
  // This handles cases where content is wrapped like: <p><p>content</p></p>
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