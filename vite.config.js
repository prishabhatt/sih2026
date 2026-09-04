import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    envPrefix: 'VITE_',
    server: {
      port: 3000,
      open: false,
      proxy: {
        // Proxy /openai/* → OpenAI base URL to avoid CORS in local dev
        '/openai': {
          target: env.VITE_OPENAI_BASE_URL || 'https://api.groq.com/openai/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/openai/, ''),
          secure: true,
        },
      },
    },
  }
})
