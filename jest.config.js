/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
    preset: "jest-puppeteer",
    testMatch: ["**/*.test.ts"],
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1"
    }
};

module.exports = config;
