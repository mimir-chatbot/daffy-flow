import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@daffy': resolve(__dirname, './src/index.ts'),
    },
  },
})
