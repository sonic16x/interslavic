import { defineConfig } from 'vite'

import { version } from './package.json'
import path from 'path'

export default defineConfig({
    define: {
        __VERSION__: JSON.stringify(version),
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
    build: {
        emptyOutDir: false,
        outDir: 'dist',
        lib: {
            entry: path.resolve(__dirname, 'src/serviceWorker/sw.ts'),
            name: 'ServiceWorker',
            formats: ['iife'],
            fileName: () => 'sw.js',
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
    },
})
