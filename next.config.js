/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3040 http://localhost:3000 http://127.0.0.1:3040 https://app.cosmicjs.com https://*.cosmicjs.com",
          },
        ],
      },
    ]
  },
  typedRoutes: false,
}

module.exports = nextConfig