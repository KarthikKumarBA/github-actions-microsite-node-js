module.exports = {
  testEnvironment: "jsdom",

  testMatch: [
    "**/tests/**/*.test.js"
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/e2e/"
  ],

  collectCoverageFrom: [
    "src/**/*.js"
  ],

  coverageDirectory: "coverage",

  coverageReporters: [
    "text",
    "lcov"
  ],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};
