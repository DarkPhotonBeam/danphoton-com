/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cms.danphoton.com',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
}

module.exports = nextConfig
