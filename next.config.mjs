/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
    images: {
        domains: ['img.daisyui.com', 'api-full-next.onrender.com', 'app.powerbi.com',  'us-east-1.online.tableau.com', 'localhost', 'lh3.googleusercontent.com'],
      },
    
};

export default nextConfig;
