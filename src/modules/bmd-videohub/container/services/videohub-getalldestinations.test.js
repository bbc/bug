const service = require("./videohub-getalldestinations");

describe("videohub-getalldestinations", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-getalldestinations")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
