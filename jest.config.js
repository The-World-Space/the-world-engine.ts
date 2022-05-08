/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
    preset: "ts-jest",
    // globalSetup: "./test/setup.js",
    // globalTeardown: "./test/teardown.js",
    // testEnvironment: "./test/puppeteer_environment.js",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleNameMapper: {
        "@src/(.*)": "<rootDir>/src/$1",
        "three/src/Three": "<rootDir>/node_modules/three/src/Three.js"
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    globals: {
        "ts-jest": {
            useESM: true
        },
    },
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/*.test.ts",
        "!src/box2d.ts/*",
    ],
    // coverageDirectory: "coverage"
};

module.exports = config;
