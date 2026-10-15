/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      new URL('https://www.relainstitute.com/wp-content/uploads/**'),
      new URL('https://img.youtube.com/vi/**'),
    ],
    // Needed so next/image can serve uploaded Department Icon SVGs (see
    // src/app/api/admin/departments/upload-icon/route.js, which sanitizes
    // SVGs with DOMPurify before they're saved). contentSecurityPolicy keeps
    // the optimizer from executing any script that sanitization missed.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
