const service = require("./interface-combinedlist");

describe("interface-combinedlist", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./interface-combinedlist")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
