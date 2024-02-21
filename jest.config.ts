import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  extensionsToTreatAsEsm: [".ts"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
  setupFiles: ["./test/setup.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["./dist/"],
  transform: { "^.+\\.tsx?$": ["ts-jest", { useESM: true }] },
};

export default jestConfig;
