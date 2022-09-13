/* eslint-disable @typescript-eslint/naming-convention */
import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    //globalSetup: "./test/setup.ts",
    //globalTeardown: "./test/teardown.ts",
    //testEnvironment: "./test/puppeteer_environment.ts",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/mocks/fileMock.ts",
        "\\.(css|less)$": "<rootDir>/test/mocks/styleMock.ts",
        "@src/(.*)": "<rootDir>/src/$1",
        "three/(.*)": ["<rootDir>/node_modules/three/$1", "<rootDir>/src/engine/script/three/$1"]
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!three|js-sdsl)"
    ],
    moduleDirectories: ["node_modules", "src"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/*.test.ts",
        "!src/box2d.ts/*"
    ]
};

export default config;
