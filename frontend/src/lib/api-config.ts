// Configuration file for API endpoints

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// External API URL for direct calls
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:5222'
  : (process.env.NEXT_PUBLIC_API_URL || 'https://api.aidenr.dev');

// URL for browser-side API calls (uses our Next.js API routes as proxy in development)
export const BROWSER_API_BASE_URL = isDevelopment
  ? '' // Empty string means use relative path (our Next.js API routes)
  : (process.env.NEXT_PUBLIC_API_URL || 'https://api.aidenr.dev');

// Log the API URLs being used (helpful for debugging)
if (typeof window !== 'undefined') {
  console.log(`External API endpoint: ${API_BASE_URL}`);
  console.log(`Browser API endpoint: ${BROWSER_API_BASE_URL || '(using Next.js API routes)'}`);
}

// Helper function to get full API URLs for browser-side calls
export function getApiUrl(path: string): string {
  // In development, use Next.js API routes to avoid CORS issues
  if (isDevelopment) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // In production, use the full API URL
  return `${BROWSER_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Helper for server-side API calls (always use direct API URL)
export function getServerApiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
