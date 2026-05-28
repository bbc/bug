const service = require("./interface-combined");

describe("interface-combined", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./interface-combined")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
