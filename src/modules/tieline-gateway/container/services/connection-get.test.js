const service = require("./connection-get");

describe("connection-get", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./connection-get")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
