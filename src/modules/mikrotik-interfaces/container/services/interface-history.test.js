const service = require("./interface-history");

describe("interface-history", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./interface-history")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
