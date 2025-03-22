import { defineConfig } from 'vite'

import { version } from './package.json'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import svgr from 'vite-plugin-svgr'

// eslint-disable-next-line no-console
console.log('Version', version)

export default defineConfig({
    publicDir: 'static',
    plugins: [
        react(),
        svgr({
            svgrOptions: { exportType: 'default' },
            include: '**/*.svg',
        }),
        visualizer({
            filename: 'report.html',
            gzipSize: true,
        }),
    ],
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
    },
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
})
