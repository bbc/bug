const service = require("./lease-add");

describe("lease-add", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-add")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
