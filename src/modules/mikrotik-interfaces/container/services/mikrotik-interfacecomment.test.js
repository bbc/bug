const service = require("./mikrotik-interfacecomment");

describe("mikrotik-interfacecomment", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./mikrotik-interfacecomment")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
