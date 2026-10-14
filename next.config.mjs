/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      new URL('https://www.relainstitute.com/wp-content/uploads/**'),
      new URL('https://img.youtube.com/vi/**'),
    ],
  },
};

export default nextConfig;
