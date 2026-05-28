const service = require("./button-setquad");

describe("button-setquad", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./button-setquad")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
