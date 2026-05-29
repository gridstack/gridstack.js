import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'gridstack/dist/react': fileURLToPath(
        new URL('./projects/lib/src/index.ts', import.meta.url)
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [fileURLToPath(new URL('./vitest.setup.ts', import.meta.url))],
    include: ['projects/lib/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
  },
})
