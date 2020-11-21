const { override, fixBabelImports, addLessLoader } = require('customize-cra')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const defaultThemeVars = require('./src/theme.json')

module.exports = override(
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
