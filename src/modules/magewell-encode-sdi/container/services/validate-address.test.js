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

    test("rejects malformed IPv4-like addresses", async () => {
        const result = await service({ address: "172.27.2122" });

        expect(mockProbe).not.toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    test("probes when address format is valid", async () => {
        mockProbe.mockResolvedValue({ alive: true });

        const result = await service({ address: "192.168.1.1" });

        expect(mockProbe).toHaveBeenCalledWith("192.168.1.1");
        expect(result).toBeDefined();
    });
});
