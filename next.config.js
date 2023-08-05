/** @type {import('next').NextConfig} */
const nextConfig = 
{
  reactStrictMode: true,
  distDir: "build",
  images: {
    domains: ['openweathermap.org','automationtest.moneyar.com'],
  },
}

module.exports = nextConfig
