module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/models/**/*', // ignore typescript models
    '!<rootDir>/src/scss/**/*', // ignore styles
  ],
  testRegex: '/__tests__/.*\\.(ts|tsx|js)$',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src$1',
  },
};
