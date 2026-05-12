/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfigFactory from './vite.config'

// mode: 'development' (not 'test') lets vite.config.ts's loadEnv() pick up .env.development,
// so VITE_* vars are injected into the define block (process.env.REACT_APP_*).
// command: 'serve' lets vite.config.ts resolve nodeEnv to 'development'.
const viteConfig = viteConfigFactory({ command: 'serve', mode: 'development' })

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
)
