const service = require("./group-addbutton");

describe("group-addbutton", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./group-addbutton")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
