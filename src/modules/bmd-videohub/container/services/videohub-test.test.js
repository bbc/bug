const service = require("./videohub-test");

describe("videohub-test", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-test")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
