/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN;

const connectSrc = ["'self'"];
if (apiOrigin) {
  connectSrc.push(apiOrigin);
}

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const scriptSrc = isDev ? "script-src 'self' 'unsafe-eval'" : "script-src 'self'";
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; ${scriptSrc}; connect-src ${connectSrc.join(" ")}; frame-ancestors 'none'; base-uri 'self'`,
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
