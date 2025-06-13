// Scroll to top utility functions

export const scrollToTop = (behavior = 'smooth') => {
  try {
    // Check if smooth scroll is supported
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior
      });
    } else {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  } catch (error) {
    // Fallback if window.scrollTo fails
    console.warn('Scroll to top failed, using fallback:', error);
    try {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (fallbackError) {
      console.warn('All scroll methods failed:', fallbackError);
    }
  }
};

export const scrollToTopInstant = () => {
  scrollToTop('auto');
};

// Custom hook for scroll to top on route changes
export const useScrollToTop = () => {
  return scrollToTop;
}; 