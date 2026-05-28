const service = require("./validate-auth");

describe("validate-auth", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./validate-auth")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
