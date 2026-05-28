const service = require("./group-connect");

describe("group-connect", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-connect")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
