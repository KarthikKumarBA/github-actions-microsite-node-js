function getPipelineMessage() {
  return "CI/CD Pipeline Working";
}

if (typeof document !== "undefined") {
  const button = document.getElementById("test-button");

  if (button) {
    button.addEventListener("click", () => {
      alert(getPipelineMessage());
    });
  }
}

if (typeof module !== "undefined") {
  module.exports = { getPipelineMessage };
}
