const service = require("./validate-address");

describe("validate-address", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./validate-address")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
