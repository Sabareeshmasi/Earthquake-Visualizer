import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      // Allow CodeSandbox preview hosts
      /.+\.csb\.app$/
    ]
  },
  optimizeDeps: {
    include: ['three', 'react-globe.gl'],
    esbuildOptions: {
      target: 'esnext'
    }
  }
})

