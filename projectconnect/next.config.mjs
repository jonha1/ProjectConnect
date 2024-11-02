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
        },
        {
          source: '/login',
          destination: '/pages/login',
        },
      ];
    },
  };
  
  export default nextConfig;
  