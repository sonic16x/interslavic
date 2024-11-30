const fs = require('fs')

const nowDate = (new Date()).toISOString().split('T')[0]

const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
        <loc>https://interslavic-dictionary.com/</loc>
        <lastmod>${nowDate}T00:00:00+00:00</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
     </url>
     <url>
        <loc>https://interslavic-dictionary.com/about</loc>
        <lastmod>${nowDate}T00:00:00+00:00</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
     </url>
     <url>
        <loc>https://interslavic-dictionary.com/grammar</loc>
        <lastmod>${nowDate}T00:00:00+00:00</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
     </url>
  </urlset>
`

fs.writeFileSync('./dist/sitemap.xml', sitemap)
