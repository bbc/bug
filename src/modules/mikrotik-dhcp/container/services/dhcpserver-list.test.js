const service = require("./dhcpserver-list");

describe("dhcpserver-list", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./dhcpserver-list")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
