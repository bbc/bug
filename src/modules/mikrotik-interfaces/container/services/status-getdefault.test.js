const service = require("./status-getdefault");

describe("status-getdefault", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./status-getdefault")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
