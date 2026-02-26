import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

const httpsConfig = fs.existsSync('./localhost+2-key.pem')
  ? {
      key: fs.readFileSync('./localhost+2-key.pem'),
      cert: fs.readFileSync('./localhost+2.pem'),
    }
  : undefined

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8443,
    https: httpsConfig,
  },
})
