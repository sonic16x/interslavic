import { defineConfig } from 'vite'

import { version } from './package.json'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import svgr from 'vite-plugin-svgr'

export const commonConfig = {
    define: {
        __VERSION__: JSON.stringify(version),
        __PR_NUMBER__: JSON.stringify(process.env.PR_NUMBER),
        __PRODUCTION__: JSON.stringify(process.env.NODE_ENV === 'development'),
        __DICTIONARY_UPDATE_TIME: JSON.stringify(new Date().toUTCString()),
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
}

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
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'react'
                        if (id.includes('react-dom')) return 'react-dom'
                    }
                },
            },
        },
    },
    server: {
        port: 3000,
    },
    ...commonConfig,
})
