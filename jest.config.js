module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  moduleNameMapper: {
    '^react-router$': '<rootDir>/src/router/reactRouterCompat.tsx',
    '^react-router-dom$': '<rootDir>/src/router/reactRouterCompat.tsx',
  },
  transformIgnorePatterns: ['/node_modules/(?!\\.pnpm/lodestar-app-element|lodestar-app-element)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'json'],
}
