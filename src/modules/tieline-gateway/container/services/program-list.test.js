const service = require("./program-list");

describe("program-list", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./program-list")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
