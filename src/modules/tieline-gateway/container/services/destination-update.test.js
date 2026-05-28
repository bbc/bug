const service = require("./destination-update");

describe("destination-update", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./destination-update")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
