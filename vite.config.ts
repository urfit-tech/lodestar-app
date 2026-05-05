import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { AntdResolve, createStyleImportPlugin } from 'vite-plugin-style-import'
import themeVars from './src/theme.json'

const sourceRoot = path.resolve(__dirname, 'src')

const ReactCompilerConfig = {
  target: '17',
  compilationMode: 'annotation',
  sources: (filename: string) =>
    filename.includes(sourceRoot) &&
    !filename.includes('lodestar-app-element'),
}

export default defineConfig(() => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    createStyleImportPlugin({
      include: ['**/*.{ts,tsx,js,jsx}'],
      exclude: /node_modules[\\/](?!lodestar-app-element[\\/]src)/,
      resolves: [AntdResolve()],
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: name => `antd/es/${name}/style/index.js`,
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: themeVars,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('node_modules/antd/')) return 'antd'
          if (id.includes('node_modules/')) return 'vendors'
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
  server: {
    port: 3333,
  },
}))
