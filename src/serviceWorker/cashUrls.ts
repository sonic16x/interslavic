import { ADD_LANGS } from 'consts'

const TRANSLATOR_DICTS = [
    '/dicts/ru/config.json',
    '/dicts/ru/grammemes.json',
    '/dicts/ru/gramtab-opencorpora-ext.json',
    '/dicts/ru/gramtab-opencorpora-int.json',
    '/dicts/ru/meta.json',
    '/dicts/ru/p_t_given_w.intdawg',
    '/dicts/ru/paradigms.array',
    '/dicts/ru/prediction-suffixes-0.dawg',
    '/dicts/ru/prediction-suffixes-1.dawg',
    '/dicts/ru/prediction-suffixes-2.dawg',
    '/dicts/ru/suffixes.json',
    '/dicts/ru/words.dawg',

    '/dicts/uk/config.json',
    '/dicts/uk/grammemes.json',
    '/dicts/uk/gramtab-opencorpora-ext.json',
    '/dicts/uk/gramtab-opencorpora-int.json',
    '/dicts/uk/meta.json',
    '/dicts/uk/paradigms.array',
    '/dicts/uk/prediction-suffixes-0.dawg',
    '/dicts/uk/prediction-suffixes-1.dawg',
    '/dicts/uk/prediction-suffixes-2.dawg',
    '/dicts/uk/prediction-suffixes-3.dawg',
    '/dicts/uk/suffixes.json',
    '/dicts/uk/words.dawg',
]

export const CASH_URLS = [
    '/',
    '/data/basic.json',
    '/data/translateStatistic.json',
    ...ADD_LANGS.map((lang) => `/data/${lang}.json`),
    ...TRANSLATOR_DICTS,
    '/sw.js',
]
