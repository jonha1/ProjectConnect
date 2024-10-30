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
        }
      ];
    },
  };
  
  export default nextConfig;
  