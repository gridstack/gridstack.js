import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: 'gridstack/dist/vue',
        replacement: fileURLToPath(new URL('./projects/lib/src/index.ts', import.meta.url)),
      },
      {
        find: /^gridstack$/,
        replacement: fileURLToPath(new URL('../src/gridstack.ts', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [fileURLToPath(new URL('./vitest.setup.ts', import.meta.url))],
    include: ['projects/lib/**/*.test.{ts,vue}', 'src/**/*.test.{ts,vue}'],
  },
})
