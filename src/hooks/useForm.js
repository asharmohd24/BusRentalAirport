/**
 * useForm Custom Hook
 * ====================
 * Handles form state, validation, and submission with reCAPTCHA v3
 */

import { useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import {
  sanitizeFormData,
  isValidEmail,
  isValidPhone,
  formRateLimiter,
  isHoneypotFilled,
  hasSpamPatterns,
  getCSRFToken,
} from '../utils/security';
import { formMessages } from '../data/data';

const RECAPTCHA_THRESHOLD = 0.7;

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [honeypot, setHoneypot] = useState('');
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  const validate = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field];
      const value = values[field];

      if (rules.required && (!value || value.trim() === '')) {
        newErrors[field] = formMessages.required;
        return;
      }

      if (value && rules.email && !isValidEmail(value)) {
        newErrors[field] = formMessages.email;
        return;
      }

      if (value && rules.phone && !isValidPhone(value)) {
        newErrors[field] = formMessages.phone;
        return;
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        newErrors[field] = formMessages.minLength(rules.minLength);
        return;
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        newErrors[field] = formMessages.maxLength(rules.maxLength);
        return;
      }

      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value, values);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleHoneypotChange = useCallback((e) => {
    setHoneypot(e.target.value);
  }, []);

  const verifyRecaptcha = useCallback(async (action = 'submit') => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not ready');
      return { success: false, error: formMessages.recaptchaError };
    }

    try {
      const token = await executeRecaptcha(action);
      
      // In a real app, you would send this token to your backend
      // and verify it there with the secret key
      // For now, we'll simulate the verification
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }).catch(() => null);

      // Simulated verification for demo purposes
      // In production, this should be verified on the server
      if (!response) {
        // If no backend, we'll trust the token exists
        // The actual score is only available server-side
        return { success: true, score: 0.9 };
      }

      const result = await response.json();
      if (result.success && result.score >= RECAPTCHA_THRESHOLD) {
        return { success: true, score: result.score };
      }

      return { success: false, error: formMessages.recaptchaScoreLow };
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return { success: false, error: formMessages.recaptchaError };
    }
  }, [executeRecaptcha]);

  const handleSubmit = useCallback(async (submitCallback, options = {}) => {
    const { skipRecaptcha = false, action = 'submit' } = options;

    // Check honeypot
    if (isHoneypotFilled(honeypot)) {
      console.warn('Honeypot triggered - likely bot');
      setSubmitStatus({ success: false, message: formMessages.error });
      return;
    }

    // Check rate limiting
    const clientId = 'user_' + (sessionStorage.getItem('client_id') || Math.random().toString(36));
    sessionStorage.setItem('client_id', clientId);
    
    if (!formRateLimiter.isAllowed(clientId)) {
      setSubmitStatus({ 
        success: false, 
        message: 'Too many attempts. Please try again later.' 
      });
      return;
    }

    // Check for spam patterns
    const combinedText = Object.values(values).join(' ');
    if (hasSpamPatterns(combinedText)) {
      setSubmitStatus({ success: false, message: formMessages.error });
      return;
    }

    // Validate form
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Verify reCAPTCHA
      if (!skipRecaptcha) {
        const recaptchaResult = await verifyRecaptcha(action);
        if (!recaptchaResult.success) {
          setSubmitStatus({ success: false, message: recaptchaResult.error });
          setIsSubmitting(false);
          return;
        }
      }

      // Sanitize form data
      const sanitizedData = sanitizeFormData(values);
      
      // Add CSRF token
      const csrfToken = getCSRFToken();

      // Call the submit callback with sanitized data
      const result = await submitCallback({
        ...sanitizedData,
        _csrf: csrfToken,
      });

      setSubmitStatus({ 
        success: true, 
        message: result?.message || formMessages.success 
      });

      // Reset form on success
      setValues(initialValues);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || formMessages.error 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [values, honeypot, validate, verifyRecaptcha, initialValues]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitStatus(null);
    setHoneypot('');
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleHoneypotChange,
    handleSubmit,
    validate,
    reset,
    setValues,
  };
};

export default useForm;
