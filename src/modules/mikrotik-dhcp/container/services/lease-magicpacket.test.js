const service = require("./lease-magicpacket");

describe("lease-magicpacket", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-magicpacket")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
