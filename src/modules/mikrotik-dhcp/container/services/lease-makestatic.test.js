const service = require("./lease-makestatic");

describe("lease-makestatic", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-makestatic")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
