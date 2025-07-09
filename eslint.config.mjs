import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    // Основные правила
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'warn', // Предупреждение для console.log
    },
  },
  {
    // Игнорируемые папки и файлы
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
    ],
  },
  {
    // Настройки для JavaScript-файлов
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    // Настройки для тестов
    files: ['**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest, // Добавляем глобальные переменные Jest
      },
    },
  },
];