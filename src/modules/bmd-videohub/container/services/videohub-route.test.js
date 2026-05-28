const service = require("./videohub-route");

describe("videohub-route", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-route")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
