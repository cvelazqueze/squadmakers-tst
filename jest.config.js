module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ]
};
