module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.{js,jsx}', '**/?(*.)+(spec|test).{js,jsx}'],
    moduleFileExtensions: ['js', 'jsx', 'json'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@modules/(.*)$': '<rootDir>/../modules/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@data/(.*)$': '<rootDir>/src/data/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@redux/(.*)$': '<rootDir>/src/redux/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@stories/(.*)$': '<rootDir>/src/stories/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.stories.{js,jsx}',
        '!src/index.js',
    ],
};
