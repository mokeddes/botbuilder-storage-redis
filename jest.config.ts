import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  globals: {
    'ts-jest': {
      // Use ts-jest for typescript files
      tsConfig: 'tsconfig.json'
    }
  },

  preset: 'ts-jest',

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  testEnvironment: 'node',
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/__tests__/.eslintrc.js'
  ],
  moduleNameMapper: {
    '@lib/(.*)$': '<rootDir>/lib/$1',
    '@src/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(ts)?$': 'ts-jest'
  },
  testMatch: ['**/__tests__/**/*.(ts)']
};
export default config;
