const service = require("./status-checkdevice");

describe("status-checkdevice", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./status-checkdevice")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
