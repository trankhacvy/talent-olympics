/**
 * @type {import('next').NextConfig}
 */
const config = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "crypto", "http", "https")
    return config
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["crypto-js"],
}

export default config
