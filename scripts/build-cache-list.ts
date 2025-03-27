import * as fs from 'fs'

const assets = fs.readdirSync('./dist/assets')
const data = fs.readdirSync('./dist/data')

const cacheList = [
    '/',
    ...assets.map((item) => `/assets/${item}`),
    ...data.map((item) => `/data/${item}`),
]

fs.writeFileSync('./dist/cacheList.json', JSON.stringify(cacheList))
