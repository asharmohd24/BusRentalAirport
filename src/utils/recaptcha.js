// src/utils/recaptcha.js

/**
 * Executes reCAPTCHA v3 and returns a token.
 * @param {string} action - The action name (e.g., 'booking_form', 'contact_form')
 * @returns {Promise<string>} - The reCAPTCHA token
 */
export const getRecaptchaToken = async (action) => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(
          import.meta.env.VITE_RECAPTCHA_SITE_KEY,
          { action }
        );
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
};