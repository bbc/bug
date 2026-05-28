const service = require("./button-seticon");

describe("button-seticon", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./button-seticon")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
