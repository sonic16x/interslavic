import * as fs from 'fs'

const assets = fs.readdirSync('./dist/assets')
const icons = fs.readdirSync('./dist/icons')
const data = fs.readdirSync('./dist/data')
const dictsRu = fs.readdirSync('./dist/dicts/ru')
const dictsUk = fs.readdirSync('./dist/dicts/uk')

const cacheList = [
    '/',
    'sw.js',
    ...assets.map((item) => `/assets/${item}`),
    ...icons.map((item) => `/icons/${item}`),
    ...data.map((item) => `/data/${item}`),
    ...dictsRu.map((item) => `/dicts/ru/${item}`),
    ...dictsUk.map((item) => `/dicts/uk/${item}`),
].filter((item) => !item.endsWith('.br') && !item.endsWith('.gz'))

fs.writeFileSync('./dist/cacheList.json', JSON.stringify(cacheList))
