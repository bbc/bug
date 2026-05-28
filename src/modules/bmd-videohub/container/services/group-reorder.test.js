const service = require("./group-reorder");

describe("group-reorder", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-reorder")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
