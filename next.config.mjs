import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["bcryptjs", "jsonwebtoken", "nodemailer", "razorpay"],
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV === "development";
    const defaultBackend = isDev ? "http://localhost:5000" : "https://abaya-backend-z5t3.onrender.com";
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || defaultBackend;
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
