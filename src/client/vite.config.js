import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    base: '/',
    plugins: [
        react(),
        svgr()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@modules': path.resolve(__dirname, '../modules'),
            '@components': path.resolve(__dirname, './src/components'),
            '@core': path.resolve(__dirname, './src/core'),
            '@data': path.resolve(__dirname, './src/data'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@redux': path.resolve(__dirname, './src/redux'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
        },
        dedupe: [
            'react',
            'react-dom',
            '@mui/material',
            '@emotion/react',
            '@emotion/styled',
            '@mui/system'
        ]
    },
    customLogger: {
        info: (msg) => { if (!msg.includes('proxy error')) console.info(msg) },
        warn: (msg) => { if (!msg.includes('proxy error')) console.warn(msg) },
        error: (msg) => {
            if (!msg.includes('proxy error') && !msg.includes('ECONNREFUSED')) {
                console.error(msg);
            }
        },
    },
    ssr: {
        noExternal: ['recharts'],
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3101',
                changeOrigin: true,
            },
            '/container': {
                target: 'http://127.0.0.1:3101',
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://127.0.0.1:3101',
                ws: true,
                changeOrigin: true,
            }
        },
        watch: {
            ignored: [
                path.resolve(__dirname, '../modules/*/container/**'),
                '**/node_modules/resolve/test/**',
                '**/src/server/config/**',
            ],
            usePolling: true,
            interval: 100
        },
        hmr: {
            clientPort: 3000,
            protocol: 'ws',
            host: 'localhost',
            port: 3000,
        },
        fs: {
            allow: ['..']
        },
    },
    optimizeDeps: {
        entries: [
            'index.html',
            'src/main.jsx',
            '../modules/*/client/Module.jsx',
            '../modules/*/client/Toolbar.jsx'
        ],
        include: [
            'react',
            'react-dom',
            'react-redux',
            '@reduxjs/toolkit',
            'notistack',
            'socket.io-client',
            '@mui/material',
            '@emotion/react',
            '@emotion/styled'
        ],
        exclude: ['@modules']
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        chunkSizeWarningLimit: 3000,
        rollupOptions: {
            external: [
                /\/container\//,
                /\/node_modules\/.*\/test\//
            ]
        }
    },
});