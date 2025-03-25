import { ADD_LANGS } from 'consts'

export const CASH_URLS = [
    '/',
    '/data/basic.msgpack',
    '/data/translateStatistic.msgpack',
    ...ADD_LANGS.map((lang) => `/data/${lang}.msgpack`),
    '/sw.js',
]
