const service = require("./group-set");

describe("group-set", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-set")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
