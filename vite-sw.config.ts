import { defineConfig } from 'vite'

import { commonConfig } from './vite.config'
import path from 'path'

export default defineConfig({
    ...commonConfig,
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
