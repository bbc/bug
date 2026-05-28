const service = require("./lease-disable");

describe("lease-disable", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-disable")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
