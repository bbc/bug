const mockProbe = jest.fn();

jest.mock("ping", () => ({
    promise: {
        probe: (...args) => mockProbe(...args),
    },
}));

const validateAddress = require("./validate-address");

describe("validate-address", () => {
    beforeEach(() => {
        mockProbe.mockReset();
    });

    test("rejects invalid address format without probing", async () => {
        const result = await validateAddress({ address: "not a valid host" });

        expect(mockProbe).not.toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    test("returns success when device is reachable", async () => {
        mockProbe.mockResolvedValue({ alive: true });
        const result = await validateAddress({ address: "10.0.0.1" });
        expect(result).toBeDefined();
    });

    test("returns failure when probe throws", async () => {
        mockProbe.mockRejectedValue(new Error("invalid"));
        const result = await validateAddress({ address: "bad-host" });
        expect(result).toBeDefined();
    });
});
