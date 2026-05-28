const service = require("./program-load");

describe("program-load", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./program-load")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
