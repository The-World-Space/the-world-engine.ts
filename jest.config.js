/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
    preset: "ts-jest",
    // globalSetup: "./test/setup.js",
    // globalTeardown: "./test/teardown.js",
    // testEnvironment: "./test/puppeteer_environment.js",
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleNameMapper: {
        "@src/(.*)": "<rootDir>/src/$1"
    },
    moduleDirectories: [
        "node_modules",
        "src"
    ],
    moduleFileExtensions: [
        "ts",
        "js",
        "json"
    ],
    modulePathIgnorePatterns: [
        "node_modules"
    ],
    // collectCoverage: true,
    // collectCoverageFrom: [
    //     "src/**/*.ts",
    //     "!src/**/*.d.ts",
    //     "!src/**/*.test.ts",
    // ],
    // coverageDirectory: "coverage"
};

module.exports = config;
