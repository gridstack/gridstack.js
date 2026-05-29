import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // React wrapper source
      {
        find: 'gridstack/dist/react',
        replacement: fileURLToPath(
          new URL('./projects/lib/src/index.ts', import.meta.url)
        ),
      },
      // Core gridstack: use local src so local patches (e.g. lazy-load drag fix) apply.
      // Regex exact-match avoids clobbering gridstack/dist/gridstack.css etc.
      {
        find: /^gridstack$/,
        replacement: fileURLToPath(
          new URL('../src/gridstack.ts', import.meta.url)
        ),
      },
    ],
  },
})
