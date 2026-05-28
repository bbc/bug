const service = require("./videohub-getlabels");

describe("videohub-getlabels", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-getlabels")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
