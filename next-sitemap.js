module.exports = {
  siteUrl: (process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") ? `https://${process.env.VERCEL_URL}` : "https://tgsnake.js.org",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude : ["/login","/api","/pages/*","/beta/*"]
}
