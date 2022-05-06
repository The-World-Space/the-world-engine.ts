/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
    globalSetup: './test/setup.js',
    globalTeardown: './test/teardown.js',
    testEnvironment: './test/puppeteer_environment.js',
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1"
    }
};

module.exports = config;
