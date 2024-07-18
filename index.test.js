const { spawn } = require("child_process");
const path = require("path");

const cli = path.join(__dirname, "index.js");

// Increasing global timeout to 60 seconds otherwise CLI tests fails.
jest.setTimeout(60000);

describe("Pre-Push Checklist CLI", () => {
  test("CLI should exit with code 1 when not all items are checked", (done) => {
    const child = spawn("node", [cli]);
    let output = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
      child.stdin.write("n\n");
    });

    child.on("close", (code) => {
      expect(code).toBe(1);
      expect(output).toContain("The following items are still unchecked:");
      done();
    });
  });
  test("CLI should exit with code 0 when all items are checked", (done) => {
    const child = spawn("node", [cli]);
    let output = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
      child.stdin.write("y\n");
    });

    child.on("close", (code) => {
      expect(code).toBe(0);
      expect(output).toContain(
        "Great! You have completed all checks. You can proceed with your push."
      );
      done();
    });
  });

  test("CLI should display all sections", (done) => {
    const child = spawn("node", [cli]);
    let output = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
      child.stdin.write("n\n");
    });

    child.on("close", () => {
      expect(output).toContain("1. Mobile");
      expect(output).toContain("2. Unit test");
      expect(output).toContain("3. Cross browser test");
      expect(output).toContain("4. Different accounts");
      expect(output).toContain("5. Translations");
      expect(output).toContain("6. Mock data");
      expect(output).toContain("7. Happy flows");
      expect(output).toContain("8. After merging");
      done();
    });
  });
});
