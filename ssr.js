const puppeteer = require('puppeteer')
const static = require('node-static')
const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 8080
const DIST_FOLDER = path.join(__dirname, 'dist')
const URL = `http://localhost:${PORT}`
const WAIT_SELECTOR = '.dictionary-page'
const OUTPUT_FILE = path.join(DIST_FOLDER, 'index.html')

function startServer() {
    return new Promise((resolve) => {
        const fileServer = new static.Server(DIST_FOLDER)
        const server = http.createServer((req, res) => {
            req.addListener('end', () => fileServer.serve(req, res)).resume()
        })

        server.listen(PORT, () => resolve(server))
    })
}

async function renderPage() {
    const server = await startServer()
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    try {
        await page.goto(URL, { waitUntil: 'networkidle2' })
        await page.waitForSelector(WAIT_SELECTOR, { timeout: 10000 })

        const content = await page.evaluate(() => document.documentElement.outerHTML)
        fs.writeFileSync(OUTPUT_FILE, content)
    } catch (error) {}
    finally {
        await browser.close()
        server.close()
        process.exit(0)
    }
}

renderPage()
