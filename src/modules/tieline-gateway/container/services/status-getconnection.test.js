const service = require("./status-getconnection");

describe("status-getconnection", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./status-getconnection")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
