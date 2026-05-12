import react from '@vitejs/plugin-react'
import fs from 'fs'
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

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const nodeEnv = command === 'build' ? 'production' : 'development'

  const SUPPORTED_LOCALES_FOR_BUILD = [
    'zh-cn', 'zh-tw', 'en-us', 'vi', 'id', 'ja', 'ko', 'de-de',
  ] as const
  const requestedDefaultLocale = env.VITE_DEFAULT_LOCALE || 'zh-tw'
  const resolvedDefaultLocale = (SUPPORTED_LOCALES_FOR_BUILD as readonly string[]).includes(
    requestedDefaultLocale,
  )
    ? requestedDefaultLocale
    : 'zh-tw'
  if (resolvedDefaultLocale !== requestedDefaultLocale) {
    console.warn(
      `[vite] VITE_DEFAULT_LOCALE="${requestedDefaultLocale}" not in SUPPORTED_LOCALES, using "zh-tw"`,
    )
  }
  const defaultAppMessagesJson = fs.readFileSync(
    path.resolve(__dirname, `src/translations/locales/${resolvedDefaultLocale}.json`),
    'utf8',
  )
  const defaultElementMessagesJson = fs.readFileSync(
    path.resolve(
      __dirname,
      `node_modules/lodestar-app-element/src/translations/locales/${resolvedDefaultLocale}.json`,
    ),
    'utf8',
  )

  const shouldAnalyze = command === 'build' && env.ANALYZE === 'true'
  const analyzerPlugins: Plugin[] = []
  if (shouldAnalyze) {
    const { visualizer } = await import('rollup-plugin-visualizer')
    analyzerPlugins.push(
      visualizer({
        filename: 'build/stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
      }) as Plugin,
      visualizer({
        filename: 'build/stats.json',
        template: 'raw-data',
        gzipSize: true,
      }) as Plugin,
    )
  }

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
      ...analyzerPlugins,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
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
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'antd-core',
                test: /node_modules[\\/]antd[\\/](es|lib)[\\/](_util|style|locale|locale-provider|badge|button|checkbox|col|config-provider|divider|dropdown|form|grid|icon|input|layout|list|menu|message|modal|popover|row|select|skeleton|typography)[\\/]/,
                priority: 35,
              },
              { name: 'antd', test: /node_modules[\\/]antd[\\/]/, priority: 30 },
              {
                name: 'react-core',
                test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|history)[\\/]/,
                priority: 25,
              },
              {
                name: 'apollo',
                test: /node_modules[\\/](@apollo[\\/]|graphql[\\/]|graphql-tag[\\/]|@graphql)/,
                priority: 25,
              },
              {
                name: 'chakra',
                test: /node_modules[\\/](@chakra-ui[\\/]|@emotion[\\/]|framer-motion[\\/])/,
                priority: 25,
              },
              { name: 'date', test: /node_modules[\\/](moment|dayjs|date-fns)[\\/]/, priority: 25 },
              { name: 'utils', test: /node_modules[\\/](lodash|lodash-es|ramda)[\\/]/, priority: 25 },
              {
                name: 'editor',
                test: /node_modules[\\/]braft-[^/]+[\\/]/,
                priority: 25,
              },
              {
                name: 'draft',
                test: /node_modules[\\/](draft-js|draft-convert|draftjs-utils)[\\/]/,
                priority: 30,
              },
              { name: 'fullcalendar', test: /node_modules[\\/]@fullcalendar[\\/]/, priority: 25 },
              {
                name: 'markdown-editor',
                test: /node_modules[\\/](codemirror|easymde|codemirror-spell-checker)[\\/]/,
                priority: 25,
              },
              { name: 'ebook', test: /node_modules[\\/](epubjs|jszip)[\\/]/, priority: 25 },
              { name: 'screenshot', test: /node_modules[\\/]html2canvas/, priority: 25 },
              { name: 'router', test: /node_modules[\\/]@tanstack[\\/]/, priority: 25 },
              { name: 'craft', test: /node_modules[\\/]@craftjs[\\/]/, priority: 25 },
              { name: 'forms', test: /node_modules[\\/](react-hook-form|@hookform)[\\/]/, priority: 25 },
              { name: 'carousel', test: /node_modules[\\/](react-slick|slick-carousel)[\\/]/, priority: 25 },
              { name: 'messenger', test: /node_modules[\\/]react-messenger-customer-chat[\\/]/, priority: 25 },
            ],
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
      __DEFAULT_LOCALE__: JSON.stringify(resolvedDefaultLocale),
      __DEFAULT_APP_MESSAGES__: defaultAppMessagesJson,
      __DEFAULT_ELEMENT_MESSAGES__: defaultElementMessagesJson,
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
