const service = require("./status-checklinkquality");

describe("status-checklinkquality", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./status-checklinkquality")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
