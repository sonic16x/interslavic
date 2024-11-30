const fs = require('fs')
const manifest = require('../src/manifest.json')

if (process.env.PR_NUMBER && process.env.PR_NUMBER.length) {
    manifest.name = manifest.short_name =`Test ${process.env.PR_NUMBER}`
}

fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest))
