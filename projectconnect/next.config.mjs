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
        {
          source: '/account',
          destination: '/pages/account',
        },
        {
          source: '/createproject',
          destination: '/pages/createproject',
        }
      ];
    },
  };
  
  export default nextConfig;
  