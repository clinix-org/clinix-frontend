import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';


const apiProxyTarget = process.env.DEV_API_PROXY_TARGET;

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    server: {
        watch: {
            // HOT RELOAD no Docker Desktop: consulte o time de desenvolvimento antes de alterar esta linha.
            usePolling: process.env.VITE_USE_POLLING === 'true',
            interval: 300,
        },
        proxy: apiProxyTarget
            ? {
                '/api/': {
                    target: apiProxyTarget,
                    xfwd: true,
                    rewrite: path => path.replace(/^\/api/, ''),
                },
            }
            : undefined,
    },
})
