const service = require("./videohub-setlabel");

describe("videohub-setlabel", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-setlabel")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
