const service = require("./videohub-getinputlabel");

describe("videohub-getinputlabel", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-getinputlabel")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
