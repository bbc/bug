jest.mock("oui-data", () => ({
    AABBCC: "Vendor\nAddress",
}), { virtual: true });

const service = require("./lease-list");

describe("lease-list", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-list")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
