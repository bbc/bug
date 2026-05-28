const service = require("./mikrotik-interfaceprotect");

describe("mikrotik-interfaceprotect", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./mikrotik-interfaceprotect")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
