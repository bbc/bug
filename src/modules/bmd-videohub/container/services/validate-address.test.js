const mockProbe = jest.fn();

jest.mock("ping", () => ({
    promise: {
        probe: (...args) => mockProbe(...args),
    },
}));

const service = require("./validate-address");

describe("validate-address", () => {
    beforeEach(() => {
        mockProbe.mockReset();
    });

    test("loads without syntax errors", () => {
        expect(() => require("./validate-address")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("rejects invalid address format without probing", async () => {
        const result = await service({ address: "not a valid host" });

        expect(mockProbe).not.toHaveBeenCalled();
        expect(result).toBeDefined();
    });
});
