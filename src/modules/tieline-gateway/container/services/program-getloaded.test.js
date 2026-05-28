const service = require("./program-getloaded");

describe("program-getloaded", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./program-getloaded")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
