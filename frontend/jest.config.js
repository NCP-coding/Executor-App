// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transforms TypeScript files using ts-jest
      '^.+\\.jsx?$': 'babel-jest', // Transforms JavaScript/JSX files using Babel
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Optional: Setup file for test environment
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock styles
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static assets
    },
  };
  