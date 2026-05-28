const service = require("./status-get");

describe("status-get", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./status-get")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
