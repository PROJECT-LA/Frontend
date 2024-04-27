/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, context) => {
    if (!context.isServer) {
      config.resolve.fallback.child_process = false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },
  output: 'standalone',
  eslint: {
    dirs: ['src', 'stories', 'test'],
  },
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
