import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    // Content Security Policy directive breakdown:
    // - default-src 'self': Restrict assets to the same origin by default.
    // - script-src 'self' 'unsafe-inline' 'unsafe-eval': Allowed Next.js client-side execution, dynamic rendering, and development hot module reloading (HMR).
    // - style-src 'self' 'unsafe-inline' https://fonts.googleapis.com: Allowed local styles, Next.js style injection, and Google Fonts stylesheet loading.
    // - font-src 'self' https://fonts.gstatic.com: Allowed font files loaded by Google Fonts.
    // - connect-src 'self' https://hzdtatgxabkkwyolpfzb.supabase.co wss://hzdtatgxabkkwyolpfzb.supabase.co: Allowed HTTP/REST and Realtime WebSocket connections to the Supabase backend.
    // - img-src 'self' data:: Allowed local images and inline SVG/data assets.
    // - frame-ancestors 'none': Prevent embedding this application in an iframe to mitigate clickjacking (complements X-Frame-Options).
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://hzdtatgxabkkwyolpfzb.supabase.co wss://hzdtatgxabkkwyolpfzb.supabase.co;
      img-src 'self' data:;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
