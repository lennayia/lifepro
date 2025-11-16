/**
 * imageCompression.js - Image compression utilities
 *
 * Modular functions for compressing images to WebP format
 * Used across: Client profiles, Coach profiles, Material images, etc.
 *
 * Features:
 * - Compress any image to WebP
 * - Configurable quality & dimensions
 * - Maintain aspect ratio
 * - Promise-based API
 */

/**
 * Compress image to WebP format
 *
 * @param {File|Blob} file - Image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Max width (default: 800)
 * @param {number} options.maxHeight - Max height (default: 800)
 * @param {number} options.quality - WebP quality 0-1 (default: 0.85)
 * @returns {Promise<Blob>} - Compressed WebP blob
 */
export const compressToWebP = async (file, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate dimensions (maintain aspect ratio)
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        } else if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 *
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSizeBytes - Max file size in bytes (default: 2MB)
 * @param {string[]} options.allowedTypes - Allowed MIME types (default: all images)
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSizeBytes = 2 * 1024 * 1024, // 2MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  } = options;

  // Check if file exists
  if (!file) {
    return { valid: false, error: 'Žádný soubor nevybrán' };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Soubor není obrázek' };
  }

  // Check allowed types
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Nepovolený formát. Povolené: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Soubor je příliš velký. Maximum: ${maxSizeMB} MB`
    };
  }

  return { valid: true, error: null };
};

/**
 * Get image dimensions from file
 *
 * @param {File|Blob} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Calculate compression stats
 *
 * @param {number} originalSize - Original file size in bytes
 * @param {number} compressedSize - Compressed file size in bytes
 * @returns {Object} - { originalKB, compressedKB, savedKB, savedPercent }
 */
export const getCompressionStats = (originalSize, compressedSize) => {
  const originalKB = Math.round(originalSize / 1024);
  const compressedKB = Math.round(compressedSize / 1024);
  const savedKB = originalKB - compressedKB;
  const savedPercent = Math.round((savedKB / originalKB) * 100);

  return {
    originalKB,
    compressedKB,
    savedKB,
    savedPercent,
  };
};
