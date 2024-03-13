const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [],
  },
});
module.exports = withNextra({
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.filebase.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
});
