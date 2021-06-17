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
    return config
  },
)
