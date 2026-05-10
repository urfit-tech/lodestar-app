import react from '@vitejs/plugin-react'
import { readFile } from 'fs/promises'
import path from 'path'
import { defineConfig, loadEnv, transformWithOxc } from 'vite'
import type { Plugin } from 'vite'
import { AntdResolve, createStyleImportPlugin } from 'vite-plugin-style-import'
import svgr from '@svgr/core'
import themeVars from './src/theme.json'

const sourceRoot = path.resolve(__dirname, 'src')

const ReactCompilerConfig = {
  target: '17',
  compilationMode: 'annotation',
  sources: (filename: string) => filename.includes(sourceRoot) && !filename.includes('lodestar-app-element'),
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

    return transformWithOxc(`import __svgUrl from ${JSON.stringify(`${filePath}?url`)}\n${componentCode}`, id, {
      lang: 'jsx',
    })
  },
})

const chakraStyledSystemCompatPlugin = (): Plugin => ({
  name: 'vite:chakra-styled-system-compat',
  enforce: 'pre',
  transform(code, id) {
    if (id.includes('@chakra-ui/styled-system/dist/esm/core/index.js')) {
      return {
        code: code.replace('export { Config, PropConfig, Parser } from "./types";', ''),
        map: null,
      }
    }

    return null
  },
})

const lodestarAppElementCompatPlugin = (): Plugin => ({
  name: 'vite:lodestar-app-element-compat',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('node_modules/lodestar-app-element/src/')) {
      return null
    }

    let transformed = code

    if (transformed.includes("import { now } from 'moment'")) {
      transformed = transformed.replace(
        "import { now } from 'moment'",
        "import moment from 'moment'\nconst { now } = moment",
      )
    }

    if (
      id.includes('node_modules/lodestar-app-element/src/contexts/LanguageContext.tsx') &&
      transformed.includes('require(`../translations/locales/${currentLanguage}.json`)')
    ) {
      transformed = transformed
        .replace(
          "import { IntlProvider } from 'react-intl'\nimport { useApp } from './AppContext'",
          "import { IntlProvider } from 'react-intl'\nimport { useApp } from './AppContext'\n\nconst localeMessageModules = import.meta.glob('../translations/locales/*.json', { eager: true, import: 'default' }) as Record<string, Record<string, string>>",
        )
        .replace(
          'messages = require(`../translations/locales/${currentLanguage}.json`)',
          'messages = localeMessageModules[`../translations/locales/${currentLanguage}.json`] || {}',
        )
    }

    return transformed === code ? null : { code: transformed, map: null }
  },
})

const getLegacyReactAppEnv = (env: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith('VITE_'))
      .map(([key, value]) => [`process.env.REACT_APP_${key.slice('VITE_'.length)}`, JSON.stringify(value)]),
  )

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const nodeEnv = command === 'build' ? 'production' : 'development'

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
        },
      }),
      craSvgComponentPlugin(),
      chakraStyledSystemCompatPlugin(),
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
        ajv: path.resolve(__dirname, 'src/vite-compat/ajv.ts'),
        jsonwebtoken: path.resolve(__dirname, 'src/vite-compat/jsonwebtoken.ts'),
        'react-router': path.resolve(__dirname, 'src/router/reactRouterCompat.tsx'),
        'react-router-dom': path.resolve(__dirname, 'src/router/reactRouterCompat.tsx'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          math: 'always',
          modifyVars: themeVars,
        },
      },
    },
    build: {
      outDir: 'build',
      sourcemap: false,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
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
      __DEV__: JSON.stringify(nodeEnv !== 'production'),
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env': {},
    },
    server: {
      port: 3333,
    },
    optimizeDeps: {
      // lodestar-app-element imports TS source directly, so Vite does not discover these nested CJS deps.
      include: [
        '@bobthered/tailwindcss-palette-generator',
        '@craftjs/core',
        '@craftjs/utils',
        'classnames',
        'dayjs/plugin/timezone',
        'dayjs/plugin/utc',
        'easymde',
        'react-is',
        'react-simplemde-editor',
        'react-style-editor',
      ],
      rolldownOptions: {
        plugins: [chakraStyledSystemCompatPlugin()],
      },
    },
  }
})
