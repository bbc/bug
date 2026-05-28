const service = require("./lease-enable");

describe("lease-enable", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-enable")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
