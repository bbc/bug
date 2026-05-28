const service = require("./button-remove");

describe("button-remove", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./button-remove")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
