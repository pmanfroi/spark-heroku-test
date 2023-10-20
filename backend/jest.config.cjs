module.exports = {
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  setupFilesAfterEnv: ['jest-extended/all'],
}
