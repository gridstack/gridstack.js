import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      // gridstack/dist/vue → local projects/lib/src/index.ts
      {
        find: 'gridstack/dist/vue',
        replacement: fileURLToPath(new URL('./projects/lib/src/index.ts', import.meta.url)),
      },
      // gridstack (exact) → local ../src/gridstack.ts (picks up local patches)
      {
        find: /^gridstack$/,
        replacement: fileURLToPath(new URL('../src/gridstack.ts', import.meta.url)),
      },
    ],
  },
})
