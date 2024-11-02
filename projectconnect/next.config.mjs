/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/pages/home',
        },
        {
          source: '/account',
          destination: '/pages/account',
          source: '/search',
          destination: '/pages/search',
        },
      ];
    },
  };
  
  export default nextConfig;
  