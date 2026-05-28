const service = require("./videohub-getsources");

describe("videohub-getsources", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-getsources")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
