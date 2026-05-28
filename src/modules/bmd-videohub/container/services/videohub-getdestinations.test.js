const service = require("./videohub-getdestinations");

describe("videohub-getdestinations", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-getdestinations")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
