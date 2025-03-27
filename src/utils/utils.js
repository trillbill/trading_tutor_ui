/**
 * Validates an email address and checks for aliases using the + character
 * @param {string} email - The email address to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  // Check for + character which is used for email aliases
  if (email.includes('+')) {
    return { 
      isValid: false, 
      message: 'Email addresses with "+" are not allowed. Please use your primary email address without aliases.' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long' };
  }

  return { isValid: true, message: '' };
};
