const service = require("./connection-list");

describe("connection-list", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./connection-list")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
