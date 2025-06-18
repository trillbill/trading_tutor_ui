// Scroll to top utility functions

export const scrollToTop = () => {
  try {
    // Use the most reliable method - direct DOM manipulation
    // This works consistently across all browsers and environments
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Fallback for older browsers
    
  } catch (error) {
    console.warn('Scroll to top failed:', error);
    // Final fallback - try window.scrollTo as last resort
    try {
      window.scrollTo(0, 0);
    } catch (fallbackError) {
      console.warn('All scroll methods failed:', fallbackError);
    }
  }
};

export const scrollToTopInstant = () => {
  // This is now the same as scrollToTop since we're using instant scrolling
  scrollToTop();
};

// Scroll to a specific element
export const scrollToElement = (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      // Use scrollIntoView for element scrolling
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (error) {
    console.warn('Scroll to element failed:', error);
  }
};

// Custom hook for scroll to top on route changes
export const useScrollToTop = () => {
  return scrollToTop;
}; 