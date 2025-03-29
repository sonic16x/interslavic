import * as fs from 'fs'

const assets = fs.readdirSync('./dist/assets')
const icons = fs.readdirSync('./dist/icons')
const data = fs.readdirSync('./dist/data')

const cacheList = [
    '/',
    'sw.js',
    ...assets.map((item) => `/assets/${item}`),
    ...icons.map((item) => `/icons/${item}`),
    ...data.map((item) => `/data/${item}`),
]

fs.writeFileSync('./dist/cacheList.json', JSON.stringify(cacheList))
