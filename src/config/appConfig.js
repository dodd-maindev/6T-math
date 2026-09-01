/**
 * Centralized Application Configuration.
 * Encapsulates public site keys and dynamic API endpoints.
 */
export const Config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://api.6tmath.io.vn' 
      : 'http://localhost:8000'
  ),
  TURNSTILE_SITE_KEY: process.env.REACT_APP_CLOUDFLARE_TURNSTILE_SITE_KEY || '0x4AAAAAAEjxmW0hsoyZ2F1A',
};

export default Config;
