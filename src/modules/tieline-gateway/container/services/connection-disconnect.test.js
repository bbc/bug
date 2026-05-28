const service = require("./connection-disconnect");

describe("connection-disconnect", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./connection-disconnect")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
