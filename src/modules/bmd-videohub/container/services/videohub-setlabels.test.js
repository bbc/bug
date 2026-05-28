const service = require("./videohub-setlabels");

describe("videohub-setlabels", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-setlabels")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
