const mockIsValidAddress = jest.fn();
const mockPingProbe = jest.fn();
const mockTurtleGet = jest.fn();

jest.mock("@core/isValidAddress", () => (...args) => mockIsValidAddress(...args));
jest.mock("ping", () => ({
    promise: {
        probe: (...args) => mockPingProbe(...args),
    },
}));
jest.mock("@utils/turtle-webapi", () => ({
    get: (...args) => mockTurtleGet(...args),
}));
jest.mock("@core/ValidationResult", () => function ValidationResult(items) {
    return { items };
});

const service = require("./validate-address");

describe("validate-address", () => {
    beforeEach(() => {
        mockIsValidAddress.mockReset();
        mockPingProbe.mockReset();
        mockTurtleGet.mockReset();
    });

    test("returns invalid when address format is bad", async () => {
        mockIsValidAddress.mockReturnValue(false);

        const result = await service({ address: "bad" });

        expect(result.items[0]).toMatchObject({
            state: false,
            field: "address",
            message: "Address is not valid",
        });
        expect(mockPingProbe).not.toHaveBeenCalled();
    });

    test("returns invalid when device is unreachable", async () => {
        mockIsValidAddress.mockReturnValue(true);
        mockPingProbe.mockResolvedValue({ alive: false });

        const result = await service({ address: "10.0.0.2" });

        expect(result.items[0]).toMatchObject({
            state: false,
            message: "Device is not reachable",
        });
    });

    test("returns invalid when API response is unexpected", async () => {
        mockIsValidAddress.mockReturnValue(true);
        mockPingProbe.mockResolvedValue({ alive: true });
        mockTurtleGet.mockResolvedValue({ dante: {} });

        const result = await service({ address: "10.0.0.2" });

        expect(result.items[0]).toMatchObject({
            state: false,
            message: "Device is reachable but API returned an unexpected response",
        });
    });

    test("returns invalid when API call throws", async () => {
        mockIsValidAddress.mockReturnValue(true);
        mockPingProbe.mockResolvedValue({ alive: true });
        mockTurtleGet.mockRejectedValue(new Error("timeout"));

        const result = await service({ address: "10.0.0.2" });

        expect(result.items[0]).toMatchObject({
            state: false,
            message: "Device is reachable but API is not responding",
        });
    });

    test("returns valid when ping and API checks pass", async () => {
        mockIsValidAddress.mockReturnValue(true);
        mockPingProbe.mockResolvedValue({ alive: true });
        mockTurtleGet.mockResolvedValue({ dante: [] });

        const result = await service({ address: "10.0.0.2" });

        expect(result.items[0]).toMatchObject({
            state: true,
            message: "Device is reachable and API is responding",
        });
    });
});
