const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [],
  },
});
module.exports = withNextra();
