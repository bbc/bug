const service = require("./group-disconnect");

describe("group-disconnect", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-disconnect")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
