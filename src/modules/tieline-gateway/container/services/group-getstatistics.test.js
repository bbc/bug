const service = require("./group-getstatistics");

describe("group-getstatistics", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-getstatistics")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
