const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In dev, avoid blocking startup on lint/TS; run checks via separate scripts.
  eslint: { ignoreDuringBuilds: isDev },
  typescript: { ignoreBuildErrors: isDev },
};

export default nextConfig;
