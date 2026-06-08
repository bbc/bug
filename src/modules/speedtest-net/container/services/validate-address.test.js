const mockProbe = jest.fn();

jest.mock("ping", () => ({
    promise: {
        probe: (...args) => mockProbe(...args),
    },
}));

const validateAddress = require("./validate-address");

describe("validate-address service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns success validation result when host is reachable", async () => {
        mockProbe.mockResolvedValue({ alive: true });

        const result = await validateAddress({ address: "8.8.8.8" });

        expect(mockProbe).toHaveBeenCalledWith("8.8.8.8");
        expect(result.validationResults).toEqual([
            {
                state: true,
                field: "address",
                message: "Device is reachable and connecting OK",
            },
        ]);
    });

    test("returns failure validation result when host is not reachable", async () => {
        mockProbe.mockResolvedValue({ alive: false });

        const result = await validateAddress({ address: "10.0.0.1" });

        expect(result.validationResults).toEqual([
            {
                state: false,
                field: "address",
                message: "Device is not reachable",
            },
        ]);
    });

    test("returns invalid-address validation result when probe throws", async () => {
        mockProbe.mockRejectedValue(new Error("invalid"));

        const result = await validateAddress({ address: "not-an-ip" });

        expect(result.validationResults).toEqual([
            {
                state: false,
                field: "address",
                message: "Address is not valid",
            },
        ]);
    });
});
