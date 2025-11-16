/**
 * Validation & Formatting Utilities
 *
 * Email, phone, and social media validation/formatting
 *
 * @created 11.11.2025 - Session #15
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Czech phone number
 * Accepts: +420, 00420, or 9 digits (flexible - allows any digit count)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  const cleanPhone = phone.replace(/\s/g, '');

  // Czech formats: +420XXXXXXXXX, 00420XXXXXXXXX, or any digits (flexible)
  // Must have at least 3 digits
  const phoneRegex = /^(\+420|00420)?\d{3,}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Format phone number to Czech standard
 * @param {string} phone
 * @returns {string} - Formatted as +420 XXX XXX XXX
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  // If starts with 420, remove it
  const digits = cleaned.startsWith('420') ? cleaned.slice(3) : cleaned;

  if (digits.length === 9) {
    return `+420 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phone; // Return original if can't format
};

/**
 * Social media URL prefixes
 */
export const SOCIAL_PREFIXES = {
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/in/',
  website: 'https://',
  telegram: 'https://t.me/',
};

/**
 * Auto-add prefix to social media URL if missing
 * @param {string} value - User input
 * @param {string} platform - 'facebook' | 'instagram' | 'linkedin' | 'website' | 'telegram'
 * @returns {string}
 */
export const formatSocialUrl = (value, platform) => {
  if (!value) return '';

  const prefix = SOCIAL_PREFIXES[platform];
  if (!prefix) return value;

  // If already has http:// or https://, return as-is
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  // If starts with @, remove it (for Instagram/Telegram)
  const cleaned = value.startsWith('@') ? value.slice(1) : value;

  // Add prefix
  return prefix + cleaned;
};

/**
 * Validate URL format
 * @param {string} url
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  if (!url) return true; // Optional

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get validation error message for field
 * @param {string} fieldName
 * @param {string} value
 * @param {string} fieldType - 'email' | 'phone' | 'url'
 * @returns {string|null}
 */
export const getFieldError = (fieldName, value, fieldType) => {
  if (!value) return null;

  switch (fieldType) {
    case 'email':
      return isValidEmail(value) ? null : 'Neplatný formát emailu';

    case 'phone':
      return isValidPhone(value) ? null : 'Neplatný formát telefonu (očekáváno: čísla, může začínat +420)';

    case 'url':
      return isValidUrl(value) ? null : 'Neplatný formát URL (musí začínat https://)';

    default:
      return null;
  }
};
