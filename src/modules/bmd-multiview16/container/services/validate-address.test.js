const mockPingProbe = jest.fn();
const mockVideohubTest = jest.fn();

jest.mock("ping", () => ({ promise: { probe: (...args) => mockPingProbe(...args) } }));
jest.mock("@services/videohub-test", () => (...args) => mockVideohubTest(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@core/ValidationResult", () => function ValidationResult(items) { return { items }; });

const service = require("./validate-address");

describe("validate-address", () => {
    beforeEach(() => {
        mockPingProbe.mockReset();
        mockVideohubTest.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("returns unreachable response when ping fails", async () => {
        mockPingProbe.mockResolvedValue({ alive: false });
        const result = await service({ address: "127.0.0.1", port: 9990 });
        expect(result).toBeDefined();
        expect(result.items[0]).toHaveProperty("state", false);
    });

    test("rejects invalid address format without probing", async () => {
        const result = await service({ address: "not a valid host", port: 9990 });

        expect(mockPingProbe).not.toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.items[0]).toHaveProperty("state", false);
    });

    test("returns success response when ping and videohub checks pass", async () => {
        mockPingProbe.mockResolvedValue({ alive: true });
        mockVideohubTest.mockResolvedValue(true);
        const result = await service({ address: "127.0.0.1", port: 9990 });
        expect(result.items[0]).toHaveProperty("state", true);
    });

    test("handles dependency exceptions", async () => {
        mockPingProbe.mockRejectedValue(new Error("boom"));
        const result = await service({ address: "127.0.0.1", port: 9990 });
        expect(result).toBeDefined();
        expect(result.items[0]).toHaveProperty("state", false);
    });
});
