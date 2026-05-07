module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}
