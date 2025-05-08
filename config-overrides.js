const { override, fixBabelImports, addLessLoader, removeModuleScopePlugin, babelInclude } = require('customize-cra')
const path = require('path')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const defaultThemeVars = require('./src/theme.json')

module.exports = override(
  removeModuleScopePlugin(),
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/lodestar-app-element/src'),
    path.resolve('node_modules/chart.js'),
  ]),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: defaultThemeVars,
    },
  }),
  (config, env) => {
    const isDev = env === 'development' || process.env.NODE_ENV === 'development'
    if (isDev) {
      config = rewireReactHotLoader(config, 'development')
    }
    if (!isDev) {
      config.devtool = false
    }
    const oneOfRule = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    if (oneOfRule) {
      oneOfRule.oneOf.forEach(rule => {
        if (rule.loader && rule.loader.includes('babel-loader')) {
          rule.options = {
            ...rule.options,
            cacheDirectory: true,
            compact: true,
          }
          if (Array.isArray(rule.include)) {
            rule.include.push(path.resolve(__dirname, 'node_modules/lodestar-app-element/src'))
          }
        }
      })
    }
    config.optimization.minimize = true
    config.optimization.runtimeChunk = 'single'
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 250000,
      maxInitialRequests: 5,
      automaticNameDelimiter: '-',
      cacheGroups: {
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: 'antd',
          chunks: 'all',
          priority: 20,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    }

    return config
  },
)
