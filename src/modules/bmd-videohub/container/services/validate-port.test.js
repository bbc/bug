const service = require("./validate-port");

describe("validate-port", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./validate-port")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
