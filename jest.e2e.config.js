const path = require('path');

module.exports = {
  testEnvironment: "node", // или "jsdom" для браузерных тестов, "node" для puppetteer
  transform: {
    "^.+\\.js$": "babel-jest" // Применяет Babel ко всем .js-файлам
  },
  testMatch: ['<rootDir>/e2e/**/*.test.js'], // Где искать тесты
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testTimeout: 30000, // Увеличьте таймаут для e2e-тестов
  globalSetup: './e2e/e2e.server.js',
  globalTeardown: './e2e/jest.e2e.teardown.js',
};