import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path';

export default defineConfig({
    publicDir: 'static',
    plugins: [
        react(),
        svgr({
            svgrOptions: { exportType: 'default' },
            include: '**/*.svg',
        }),
        visualizer({
            filename: 'stats.html',
            gzipSize: true,
        }),
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'), // Основная точка входа
                sw: resolve(__dirname, 'src/serviceWorker/sw.ts'), // Сервис-воркер
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    // Указываем имя файла для сервис-воркера
                    return chunkInfo.name === 'sw' ? 'sw.js' : '[name].js';
                },
            },
        },
    },
    server: {
        port: 3000,
    },
    define: {
        __VERSION__: JSON.stringify(require('./package.json').version),
        __PR_NUMBER__: JSON.stringify(process.env.PR_NUMBER || '123'),
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
