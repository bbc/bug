const service = require("./codecdb-get");

describe("codecdb-get", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./codecdb-get")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
