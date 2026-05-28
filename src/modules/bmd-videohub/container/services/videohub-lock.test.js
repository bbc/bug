const service = require("./videohub-lock");

describe("videohub-lock", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-lock")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
