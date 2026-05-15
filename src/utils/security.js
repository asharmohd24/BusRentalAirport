/**
 * Security Utilities
 * ==================
 * Security measures for form handling and data sanitization
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

/**
 * Sanitize form input - removes dangerous characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Rate limiting for form submissions
 */
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Filter out old attempts
    const recentAttempts = userAttempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  getRemainingAttempts(key) {
    const userAttempts = this.attempts.get(key) || [];
    const now = Date.now();
    const recentAttempts = userAttempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

export const formRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

/**
 * CSRF Token Management
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

let csrfToken = null;

export const getCSRFToken = () => {
  if (!csrfToken) {
    csrfToken = generateCSRFToken();
    sessionStorage.setItem('csrf_token', csrfToken);
  }
  return csrfToken;
};

export const validateCSRFToken = (token) => {
  return token === sessionStorage.getItem('csrf_token');
};

/**
 * Honeypot field validation
 * If honeypot is filled, it's likely a bot
 */
export const isHoneypotFilled = (value) => {
  return value && value.length > 0;
};

/**
 * Sanitize object - sanitizes all string values in an object
 */
export const sanitizeFormData = (data) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Check for common spam patterns
 */
export const hasSpamPatterns = (text) => {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|prize|free money)\b/gi,
    /\b(click here|buy now|act now|limited time)\b/gi,
    /(https?:\/\/[^\s]+){3,}/gi, // Multiple URLs
    /(.)\1{10,}/g, // Repeated characters
  ];
  
  return spamPatterns.some((pattern) => pattern.test(text));
};

export default {
  sanitizeHTML,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  formRateLimiter,
  getCSRFToken,
  validateCSRFToken,
  isHoneypotFilled,
  sanitizeFormData,
  hasSpamPatterns,
};
