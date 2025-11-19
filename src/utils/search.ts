/**
 * Search for query in text (case-insensitive)
 */
export const smartSearch = (text: string, query: string): boolean => {
  if (!query.trim()) return true;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Check if query is in text
  if (lowerText.includes(lowerQuery)) {
    return true;
  }
  
  // Check if all words from query are in text
  const queryWords = lowerQuery.split(' ').filter(w => w.length > 0);
  return queryWords.every(word => lowerText.includes(word));
};

/**
 * Highlight matching text in a string
 */
export const highlightText = (text: string, query: string): Array<{ text: string; highlight: boolean }> => {
  if (!query.trim()) {
    return [{ text, highlight: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) {
    return [{ text, highlight: false }];
  }

  const parts = [];
  
  if (index > 0) {
    parts.push({ text: text.substring(0, index), highlight: false });
  }
  
  parts.push({ text: text.substring(index, index + query.length), highlight: true });
  
  if (index + query.length < text.length) {
    parts.push({ text: text.substring(index + query.length), highlight: false });
  }
  
  return parts;
};
