import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
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
    server: {
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3101',
                changeOrigin: true,
            },
            '/container': {
                target: 'http://localhost:3101',
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://localhost:3101',
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
        rollupOptions: {
            external: [
                /\/container\//,
                /\/node_modules\/.*\/test\//
            ]
        }
    },
});