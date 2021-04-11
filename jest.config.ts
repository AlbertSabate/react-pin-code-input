import type { Config } from '@jest/types';

// Sync object
const jestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/index.ts'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setupTests.ts'],
  testRunner: 'jest-circus/runner',
  testMatch: ['<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePaths: [],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'jsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/.jest/fileMocks.ts',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  automock: false,
  resetMocks: false,
};

export default jestConfig;
