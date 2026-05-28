const service = require("./group-add");

describe("group-add", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-add")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
