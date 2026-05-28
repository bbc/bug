const service = require("./mikrotik-interfacerename");

describe("mikrotik-interfacerename", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./mikrotik-interfacerename")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
