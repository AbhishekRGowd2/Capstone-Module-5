// craco.config.js
module.exports = {
    babel: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ],
    },
    jest: {
      configure: (jestConfig) => {
        jestConfig.transformIgnorePatterns = [
          '/node_modules/(?!(@bundled-es-modules|msw|react-slick|axios)/)',
        ];
        jestConfig.setupFilesAfterEnv = ['<rootDir>/src/setupTests.js'];
        return jestConfig;
      },
    },
  };
  