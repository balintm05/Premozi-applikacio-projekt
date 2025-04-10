import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "reactapp1.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!env.DOCKER_ENV && !fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
    }

    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit' }).status) {
        console.warn("Could not create certificate. Running without HTTPS");
    }
}

const target = env.DOCKER_ENV
    ? 'http://reactapp1.server:7156'  
    : env.ASPNETCORE_HTTPS_PORT
        ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
        : env.ASPNETCORE_URLS
            ? env.ASPNETCORE_URLS.split(';')[0]
            : 'https://localhost:7156';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: true, 
        port: parseInt(env.VITE_PORT || '60769'),
        strictPort: true,
        https: env.DOCKER_ENV ? false : { 
            key: fs.existsSync(keyFilePath) ? fs.readFileSync(keyFilePath) : undefined,
            cert: fs.existsSync(certFilePath) ? fs.readFileSync(certFilePath) : undefined,
        },
        proxy: {
            '/api': {
                target,
                changeOrigin: true,
                secure: false,
                rewrite: path => path.replace(/^\/api/, '')
            },
            '^/weatherforecast': {
                target,
                secure: false
            }
        },
        watch: {
            usePolling: env.DOCKER_ENV ? true : false  
        }
    },
    preview: {
        port: 60769,
        host: true,
        strictPort: true
    }
});