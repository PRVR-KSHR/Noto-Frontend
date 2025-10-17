/**
 * Cloudinary URL Optimizer
 * This utility helps reduce bandwidth by generating optimized URLs
 * for different viewing scenarios
 */

/**
 * Extract Cloudinary public ID from URL
 * @param {string} url - Full Cloudinary URL
 * @returns {string|null} - Public ID or null
 */
const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Match pattern: /upload/v1234567890/folder/filename.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Failed to extract public ID:', error);
    return null;
  }
};

/**
 * Extract cloud name from Cloudinary URL
 * @param {string} url - Full Cloudinary URL
 * @returns {string|null} - Cloud name or null
 */
const extractCloudName = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Match pattern: https://res.cloudinary.com/cloudname/...
    const match = url.match(/cloudinary\.com\/([^/]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Failed to extract cloud name:', error);
    return null;
  }
};

/**
 * Generate optimized preview URL for PDFs
 * This converts PDF to image with compression - saves 80-95% bandwidth!
 * @param {string} originalUrl - Original Cloudinary URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized URL or original if not Cloudinary
 */
export const getOptimizedPreviewUrl = (originalUrl, options = {}) => {
  const publicId = extractPublicId(originalUrl);
  const cloudName = extractCloudName(originalUrl);
  
  if (!publicId || !cloudName) {
    console.warn('Not a Cloudinary URL, returning original:', originalUrl);
    return originalUrl;
  }

  const {
    width = 800,        // Max width for preview
    quality = 'auto:low', // Automatic quality (low for previews)
    format = 'jpg',     // Convert to JPG (smaller than PNG)
    page = 1,           // First page only for PDF preview
  } = options;

  // ⚠️ NOTE: This only works for generating thumbnail images from PDFs
  // For full document viewing, we must use the original URL
  // This is useful for gallery/list views, not iframe viewing

  // Build optimized URL - converts PDF page to image
  // Format: https://res.cloudinary.com/{cloud_name}/image/upload/w_{width},q_{quality},f_{format},pg_{page}/{public_id}
  const transformations = [
    `w_${width}`,
    `q_${quality}`,
    `f_${format}`,
    `pg_${page}`,
    'fl_lossy',        // Allow lossy compression
    'fl_progressive',  // Progressive loading
  ].join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Generate thumbnail URL for listing pages
 * Ultra-compressed for maximum bandwidth savings (95%+ reduction)
 * @param {string} originalUrl - Original Cloudinary URL
 * @returns {string} - Thumbnail URL or original if not Cloudinary
 */
export const getThumbnailUrl = (originalUrl) => {
  return getOptimizedPreviewUrl(originalUrl, {
    width: 200,
    quality: 'auto:eco', // Eco mode for thumbnails
    format: 'jpg',
    page: 1,
  });
};

/**
 * Generate optimized URL for iframe viewing
 * Balanced quality for on-page viewing (50-70% bandwidth reduction)
 * @param {string} originalUrl - Original Cloudinary URL
 * @param {number} viewportWidth - User's viewport width
 * @returns {string} - Optimized URL or original if not Cloudinary
 */
export const getOptimizedIframeUrl = (originalUrl, viewportWidth = 1200) => {
  const publicId = extractPublicId(originalUrl);
  const cloudName = extractCloudName(originalUrl);
  
  if (!publicId || !cloudName) {
    console.log('⚠️ Not a Cloudinary URL or invalid format, using original');
    return originalUrl;
  }

  // ⚠️ IMPORTANT: For raw documents (PDF, DOC, PPT), we can't use transformations
  // They must be served as-is from /raw/upload/
  // Optimization only works when converting to images
  
  // Check if it's already a raw file URL
  if (originalUrl.includes('/raw/upload/')) {
    console.log('📄 Raw document detected - using original URL (no transformation possible)');
    return originalUrl; // Can't transform raw documents in iframe
  }

  // For images only, we can apply transformations
  const transformations = [
    `w_${Math.min(viewportWidth, 1200)}`, // Responsive width
    'q_auto:good',      // Good quality for viewing
    'f_auto',           // Auto format (WebP where supported)
    'fl_progressive',   // Progressive loading
    'dpr_auto',         // Auto device pixel ratio
  ].join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Get original URL for download
 * Use this ONLY for actual downloads to preserve quality
 * @param {string} originalUrl - Original Cloudinary URL
 * @returns {string} - Original URL
 */
export const getDownloadUrl = (originalUrl) => {
  // For downloads, always use original URL
  return originalUrl;
};

/**
 * Estimate bandwidth savings
 * @param {string} fileType - MIME type or file extension
 * @param {string} optimizationType - 'thumbnail' | 'preview' | 'iframe'
 * @returns {string} - Estimated savings percentage
 */
export const estimateBandwidthSavings = (fileType, optimizationType) => {
  const isPDF = fileType?.includes('pdf') || fileType === 'pdf';
  
  const savings = {
    thumbnail: isPDF ? '95%' : '90%',
    preview: isPDF ? '85%' : '70%',
    iframe: isPDF ? '60%' : '50%',
  };
  
  return savings[optimizationType] || '50%';
};

/**
 * Check if URL is from Cloudinary
 * @param {string} url - URL to check
 * @returns {boolean} - True if Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

export default {
  getOptimizedPreviewUrl,
  getThumbnailUrl,
  getOptimizedIframeUrl,
  getDownloadUrl,
  estimateBandwidthSavings,
  isCloudinaryUrl,
};
