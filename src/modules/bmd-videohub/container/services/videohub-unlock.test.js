const service = require("./videohub-unlock");

describe("videohub-unlock", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-unlock")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
