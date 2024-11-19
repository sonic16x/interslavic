import { addLangs } from 'consts'

const ICONS = [
    '/icons/android-icon-36x36.png',
    '/icons/android-icon-48x48.png',
    '/icons/android-icon-72x72.png',
    '/icons/android-icon-96x96.png',
    '/icons/android-icon-144x144.png',
    '/icons/android-icon-192x192.png',
    '/icons/apple-icon.png',
    '/icons/apple-icon-57x57.png',
    '/icons/apple-icon-60x60.png',
    '/icons/apple-icon-72x72.png',
    '/icons/apple-icon-76x76.png',
    '/icons/apple-icon-114x114.png',
    '/icons/apple-icon-120x120.png',
    '/icons/apple-icon-144x144.png',
    '/icons/apple-icon-152x152.png',
    '/icons/apple-icon-180x180.png',
    '/icons/apple-icon-precomposed.png',
    '/icons/discord-icon-330x102.png',
    '/icons/favicon.ico',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon-96x96.png',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    '/icons/manifest.json',
    '/icons/ms-icon-70x70.png',
    '/icons/ms-icon-144x144.png',
    '/icons/ms-icon-150x150.png',
    '/icons/ms-icon-310x310.png',
]

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

const COMPONENTS = ['index', 'grammarComponent', 'translatorComponent', 'viewerComponent']

const STYLES = COMPONENTS.map((name) => `/styles/${name}.css`)

const SCRIPTS = COMPONENTS.map((name) => `/${name}.js`)


export const CASH_URLS = [
    '/',
    '/data/basic.json',
    '/data/translateStatistic.json',
    '/sw.js',
    ...addLangs.map((lang) => `/data/${lang}.json`),
    ...SCRIPTS,
    ...STYLES,
    ...ICONS,
    ...TRANSLATOR_DICTS,
]
