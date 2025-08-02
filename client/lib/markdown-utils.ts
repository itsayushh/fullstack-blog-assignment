/**
 * Utility function to strip markdown formatting and extract plain text
 */
export function stripMarkdown(text: string): string {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Clean up multiple newlines and spaces
    .replace(/\n{2,}/g, '\n')
    .replace(/^\s+|\s+$/g, '')
    .trim();
}

/**
 * Create a clean excerpt from markdown content
 */
export function createExcerpt(content: string, maxLength: number = 200): string {
  const plainText = stripMarkdown(content);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  
  const lastPunctuation = Math.max(lastSentence, lastExclamation, lastQuestion);
  
  if (lastPunctuation > maxLength * 0.7) {
    return plainText.substring(0, lastPunctuation + 1);
  }
  
  // If no good sentence break, find the last complete word
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    return plainText.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
