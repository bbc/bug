const service = require("./videohub-getoutputlabel");

describe("videohub-getoutputlabel", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-getoutputlabel")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
