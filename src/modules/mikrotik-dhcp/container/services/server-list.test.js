const service = require("./server-list");

describe("server-list", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./server-list")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
