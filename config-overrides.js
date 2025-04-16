const { override, fixBabelImports, addLessLoader, removeModuleScopePlugin, babelInclude } = require('customize-cra')
const path = require('path')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const defaultThemeVars = require('./src/theme.json')

module.exports = override(
  removeModuleScopePlugin(),
  babelInclude([path.resolve('src'), path.resolve('node_modules/lodestar-app-element/src')]),
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
    config = rewireReactHotLoader(config, env)
    config.optimization.minimize = true
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      maxInitialRequests: 5,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
        },
      },
    }
    const oneOfRule = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    if (oneOfRule) {
      oneOfRule.oneOf.forEach(rule => {
        if (rule.loader && rule.loader.includes('babel-loader') && Array.isArray(rule.include)) {
          rule.include.push(path.resolve(__dirname, 'node_modules/lodestar-app-element/src'))
        }
      })
    }
    return config
  },
)
