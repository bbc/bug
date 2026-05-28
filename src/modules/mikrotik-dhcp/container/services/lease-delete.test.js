const service = require("./lease-delete");

describe("lease-delete", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-delete")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
