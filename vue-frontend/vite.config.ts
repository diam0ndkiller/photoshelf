import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import httpAuth from 'vite-plugin-http-basic-auth';

// https://vite.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return ({
    plugins: [
      vue(),
      vueDevTools(),
      httpAuth(
        [
          {
            username: 'diam0ndkiller',
            password: env.VITE_AUTH_PASSWORD
          }
        ],
        {realm: '/'}
      ),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: 8090,
      host: '0.0.0.0',
    }
  })
})
