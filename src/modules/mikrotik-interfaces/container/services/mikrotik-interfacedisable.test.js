const service = require("./mikrotik-interfacedisable");

describe("mikrotik-interfacedisable", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./mikrotik-interfacedisable")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
