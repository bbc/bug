const service = require("./lease-update");

describe("lease-update", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-update")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
