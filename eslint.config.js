module.exports = [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        document: "readonly",
        alert: "readonly",
        module: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error"
    }
  }
];
