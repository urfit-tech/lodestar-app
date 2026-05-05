import react from '@vitejs/plugin-react'
import { readFile } from 'fs/promises'
import path from 'path'
import { defineConfig, loadEnv, transformWithEsbuild, type Plugin } from 'vite'
import { AntdResolve, createStyleImportPlugin } from 'vite-plugin-style-import'
import svgr from '@svgr/core'
import themeVars from './src/theme.json'

const sourceRoot = path.resolve(__dirname, 'src')

const ReactCompilerConfig = {
  target: '17',
  compilationMode: 'annotation',
  sources: (filename: string) =>
    filename.includes(sourceRoot) &&
    !filename.includes('lodestar-app-element'),
}

const craSvgComponentPlugin = (): Plugin => ({
  name: 'vite:cra-svg-react-component',
  enforce: 'pre',
  async transform(_, id) {
    const [filePath, query = ''] = id.split('?')

    if (!filePath.endsWith('.svg') || query.includes('url') || query.includes('raw')) {
      return null
    }

    const svg = await readFile(filePath, 'utf8')
    const componentCode = await svgr(
      svg,
      {},
      {
        componentName: 'ReactComponent',
        filePath,
        caller: {
          name: 'vite:cra-svg-react-component',
          previousExport: 'export default __svgUrl;',
        },
      },
    )

    return transformWithEsbuild(`import __svgUrl from ${JSON.stringify(`${filePath}?url`)}\n${componentCode}`, id, {
      loader: 'jsx',
    })
  },
})

const lodestarAppElementCompatPlugin = (): Plugin => ({
  name: 'vite:lodestar-app-element-compat',
  enforce: 'pre',
  transform(code, id) {
    if (
      !id.includes('node_modules/lodestar-app-element/src/') ||
      !code.includes("import { now } from 'moment'")
    ) {
      return null
    }

    return {
      code: code.replace("import { now } from 'moment'", "import moment from 'moment'\nconst { now } = moment"),
      map: null,
    }
  },
})

const getLegacyReactAppEnv = (env: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith('VITE_'))
      .map(([key, value]) => [`process.env.REACT_APP_${key.slice('VITE_'.length)}`, JSON.stringify(value)]),
  )

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
        },
      }),
      craSvgComponentPlugin(),
      lodestarAppElementCompatPlugin(),
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
    resolve: {
      alias: {
        jsonwebtoken: path.resolve(__dirname, 'src/vite-compat/jsonwebtoken.ts'),
      },
    },
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
      ...getLegacyReactAppEnv(env),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env': {},
    },
    server: {
      port: 3333,
    },
  }
})
