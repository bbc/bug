const service = require("./status-checkalarms");

describe("status-checkalarms", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./status-checkalarms")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
