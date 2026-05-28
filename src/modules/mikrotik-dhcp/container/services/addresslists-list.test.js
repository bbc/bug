const service = require("./addresslists-list");

describe("addresslists-list", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./addresslists-list")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
