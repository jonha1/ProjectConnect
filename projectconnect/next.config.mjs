/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/pages/home',
        },
        {
          source: '/addproject',
          destination: '/pages/addproject',
          source: '/search',
          destination: '/pages/search',
        },
        {
          source: '/account',
          destination: '/pages/account',
        }
      ];
    },
  };
  
  export default nextConfig;
  