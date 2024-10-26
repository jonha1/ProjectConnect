/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/home',
          destination: '/pages/home',
        },
      ];
    },
  };
  
  export default nextConfig;
  