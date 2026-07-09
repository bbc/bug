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

    test("rejects invalid address format without probing", async () => {

        const result = await validateAddress({ address: "not-an-ip" });

        expect(mockProbe).not.toHaveBeenCalled();
        expect(result.validationResults).toEqual([
            {
                state: false,
                field: "address",
                message: "Address is not valid",
            },
        ]);
    });
});
