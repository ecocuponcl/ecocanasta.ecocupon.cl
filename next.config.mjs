/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // Habilitar optimización de imágenes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.ecocupon.cl', // Dominio del sitio
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Para imágenes de Google
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Para avatares
      },
    ],
  },
}

export default nextConfig
