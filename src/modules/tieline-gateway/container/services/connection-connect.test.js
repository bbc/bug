const service = require("./connection-connect");

describe("connection-connect", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./connection-connect")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
