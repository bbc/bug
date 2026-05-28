const service = require("./group-liststatistics");

describe("group-liststatistics", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-liststatistics")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
