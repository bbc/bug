const service = require("./mikrotik-interfaceenable");

describe("mikrotik-interfaceenable", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./mikrotik-interfaceenable")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
