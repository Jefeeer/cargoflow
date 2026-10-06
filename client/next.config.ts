import type { NextConfig } from 'next';

// The API (quotes, contact, health) lives in src/app/api as Next.js route handlers,
// so the site and its API deploy together as one app.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root; a stray lockfile higher up the tree would otherwise be picked.
  turbopack: { root: __dirname },
};

export default nextConfig;
