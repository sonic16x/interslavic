import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import {visualizer} from 'rollup-plugin-visualizer'
import {VitePWA} from "vite-plugin-pwa";

const manifest = require('./src/manifest.json')
const VERSION = require('./package.json').version

const PRECACHE_URLS = [
    'basic.json',
    'csb.json',
    'cu.json',
    'da.json',
    'de.json',
    'dsb.json',
    'eo.json',
    'es.json',
    'fr.json',
    'he.json',
    'hsb.json',
    'ia.json',
    'it.json',
    'nl.json',
    'pt.json',
    'translateStatistic.json',
]

function getManifest() {
    if (process.env.PR_NUMBER && process.env.PR_NUMBER.length) {
        manifest.name = manifest.short_name = `Test ${process.env.PR_NUMBER}`
    }

    return manifest
}

function getPwaConfig() {
    return {
        registerType: "autoUpdate",
        manifest: getManifest(),
        workboxOptions: {
            globPatterns: PRECACHE_URLS,
        },
        workbox: {
            runtimeCaching: [
                {
                    urlPattern: /\/api\/.*/,
                    handler: "NetworkOnly",
                    options: {
                        cacheName: `network-only-${VERSION}`,
                    },
                },
                {
                    urlPattern: /\/is_com\.js/,
                    handler: "NetworkFirst",
                    options: {
                        cacheName: `network-first-${VERSION}`,
                        networkTimeoutSeconds: 10,
                    },
                },
                {
                    urlPattern: /\.(?:js|css|html|json|ico|png|jpg|jpeg|svg|webp)$/,
                    handler: "StaleWhileRevalidate",
                    options: {
                        cacheName: `static-cache-${VERSION}`,
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 60 * 60 * 24 * 30,
                        },
                    },
                },
            ],
        },
    }
}

export default defineConfig({
    publicDir: 'static',
    plugins: [
        react(),
        svgr({
            svgrOptions: {exportType: 'default'},
            include: '**/*.svg',
        }),
        visualizer({
            filename: 'report.html',
            gzipSize: true,
        }),
        VitePWA(getPwaConfig()),
    ],
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
    },
    define: {
        __VERSION__: JSON.stringify(VERSION),
        __PR_NUMBER__: JSON.stringify(process.env.PR_NUMBER),
        __PRODUCTION__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },
    resolve: {
        alias: {
            'translations': '/src/translations',
            'components': '/src/components',
            'reducers': '/src/reducers',
            'services': '/src/services',
            'routing': '/src/routing',
            'actions': '/src/actions',
            'consts': '/src/consts',
            'utils': '/src/utils',
            'hooks': '/src/hooks',
        },
    },
})
