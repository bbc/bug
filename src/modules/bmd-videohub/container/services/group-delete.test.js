const service = require("./group-delete");

describe("group-delete", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-delete")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
