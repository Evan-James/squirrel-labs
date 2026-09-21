// Webpack aliases Cloudflare's runtime module to this file for Vercel builds.
// Keep the shape intentionally open so existing route code can read optional
// environment variables without coupling the application to either host.
export const env = process.env;
