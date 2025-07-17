
export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Транспилирование всех js/jsx файлов через Babel
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Стилизация для тестов
    },
    transformIgnorePatterns: ['/node_modules/', '/packages/(?!my-project)/'], // Исключения для трансформирования
};