import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__//setupTests.tsx',
    exclude: [...configDefaults.exclude, 'e2e/*'],
  },
})
