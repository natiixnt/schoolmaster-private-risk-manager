const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In dev, avoid blocking startup on lint/TS; run checks via separate scripts.
  eslint: { ignoreDuringBuilds: isDev },
  typescript: { ignoreBuildErrors: isDev },
  webpack: (config, { dev }) => {
    if (!dev) return config;

    const existingIgnored = config.watchOptions?.ignored;
    const ignored = Array.isArray(existingIgnored)
      ? existingIgnored
      : existingIgnored
      ? [existingIgnored]
      : [];

    return {
      ...config,
      watchOptions: {
        ...(config.watchOptions || {}),
        ignored: [
          ...ignored,
          '**/.turbo/**',
          '**/*.tgz',
          '**/node_modules/**',
        ],
      },
    };
  },
};

export default nextConfig;
