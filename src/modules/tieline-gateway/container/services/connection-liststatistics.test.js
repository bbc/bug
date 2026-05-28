const service = require("./connection-liststatistics");

describe("connection-liststatistics", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./connection-liststatistics")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
