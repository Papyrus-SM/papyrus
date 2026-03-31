import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: 'localhost',
        port: 5173,
        proxy: {
            '/api': {
                target: process.env.VITE_BACKEND_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/src/api'),
            },
        },
    },
})