/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path", // Apply headers to all /api/* requests
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,POST,PUT,OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Origin, Content-Type, Access-Control-Allow-Headers, DeviceInfo, Authorization, X-Requested-With",
                    },
                ],
            },
        ];
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
    i18n: {
        locales: ["en", "es", "fr", "cn", "jp", "id", "vi", "ar"],
        defaultLocale: "en",
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "web3.coinmeca.net",
            },
        ],
    },
    experimental: {
        // ppr: true,
    },
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig;
