const service = require("./lease-comment");

describe("lease-comment", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-comment")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
