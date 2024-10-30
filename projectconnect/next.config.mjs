/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/pages/home',
        },
        {
          source: '/addpage',
          destination: '/pages/addpage',
        }
      ];
    },
  };
  
  export default nextConfig;
  