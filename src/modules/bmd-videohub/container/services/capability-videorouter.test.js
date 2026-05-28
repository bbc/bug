const service = require("./capability-videorouter");

describe("capability-videorouter", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./capability-videorouter")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
