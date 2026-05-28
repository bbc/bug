const service = require("./interface-lldp");

describe("interface-lldp", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./interface-lldp")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
