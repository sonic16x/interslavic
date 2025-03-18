const http = require('http')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const nodeStatic = require('node-static')

const PORT = 8080
const DIST_FOLDER = path.join(__dirname, '../dist')
const BASE_URL = `http://localhost:${PORT}`
const WAIT_SELECTOR = '.animation-container'
const ROUTES = [
    '/',
]

function startServer() {
    return new Promise((resolve) => {
        const fileServer = new nodeStatic.Server(DIST_FOLDER)
        const server = http.createServer((req, res) => {
            // Если запрашивается файл (не index.html) и такой файл существует в папке, отдать его
            fileServer.serve(req, res, (err, result) => {
                if (err || result.status !== 200) {
                    // Если файл не найден (например, в случае SPA-роутинга), отдаем index.html
                    fileServer.serveFile('/index.html', 200, {}, req, res)
                }
            })
        })

        server.listen(PORT, () => resolve(server))
    })
}

async function renderPage(browser, route) {
    const page = await browser.newPage()
    const url = `${BASE_URL}${route}`
    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.waitForSelector(WAIT_SELECTOR, { timeout: 20000 })

    const content = await page.evaluate(() => document.documentElement.outerHTML)
    page.close()

    fs.writeFileSync(path.join(DIST_FOLDER, `${route === '/' ? 'index' : route}.html`), content)
}

startServer().then(async (server) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    for(let route of ROUTES) {
        await renderPage(browser, route)
        console.log(`Page ${route} rendered`)
    }

    await browser.close()
    server.close()
    process.exit(0)
})
