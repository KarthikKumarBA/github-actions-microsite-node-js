const { getPipelineMessage } = require("../src/app");

describe("Microsite application", () => {
  test("returns the correct pipeline message", () => {
    expect(getPipelineMessage()).toBe("CI/CD Pipeline Working");
  });

  test("pipeline message is not empty", () => {
    expect(getPipelineMessage()).toBeTruthy();
  });
});
