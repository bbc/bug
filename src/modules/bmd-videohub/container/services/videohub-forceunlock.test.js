const service = require("./videohub-forceunlock");

describe("videohub-forceunlock", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./videohub-forceunlock")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
