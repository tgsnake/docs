module.exports = {
  siteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://tgsnake.js.org",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude : ["/login","/api","/pages/*","/beta/*"]
}