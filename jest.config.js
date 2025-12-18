module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@images/(.*)$': '<rootDir>/assets/images/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@worker-mock-server/(.*)$': '<rootDir>/worker-mock-server/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@__mocks__/(.*)$': '<rootDir>/__mocks__/$1',
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
