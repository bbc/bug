const service = require("./mikrotik-interfaceunprotect");

describe("mikrotik-interfaceunprotect", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./mikrotik-interfaceunprotect")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
