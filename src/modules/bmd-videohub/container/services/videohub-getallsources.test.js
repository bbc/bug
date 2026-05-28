const service = require("./videohub-getallsources");

describe("videohub-getallsources", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-getallsources")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
