module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // --- THIS IS THE NEW, CORRECTED LINE ---
  setupFiles: ['dotenv/config'], 
};