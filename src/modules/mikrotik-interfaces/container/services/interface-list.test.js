const service = require("./interface-list");

describe("interface-list", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./interface-list")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
