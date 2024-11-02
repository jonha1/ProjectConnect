/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/pages/home',
        },
        {
          source: '/search',
          destination: '/pages/search',
        },
      ];
    },
  };
  
  export default nextConfig;
  