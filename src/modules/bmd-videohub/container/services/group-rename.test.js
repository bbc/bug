const service = require("./group-rename");

describe("group-rename", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-rename")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
