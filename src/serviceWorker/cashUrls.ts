import { ADD_LANGS } from 'consts'

export const CASH_URLS = [
    '/',
    '/data/basic.json',
    '/data/translateStatistic.json',
    ...ADD_LANGS.map((lang) => `/data/${lang}.json`),
    '/sw.js',
]
