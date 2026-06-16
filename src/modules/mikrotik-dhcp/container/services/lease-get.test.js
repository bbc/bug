jest.mock("oui-data", () => ({
    AABBCC: "Vendor\nAddress",
}), { virtual: true });

const service = require("./lease-get");

describe("lease-get", () => {
    test("loads without syntax errors", () => {
        expect(() => require("./lease-get")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });
});
