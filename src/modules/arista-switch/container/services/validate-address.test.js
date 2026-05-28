const mockPingProbe = jest.fn();
jest.mock("ping", () => ({ promise: { probe: (...args) => mockPingProbe(...args) } }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@core/ValidationResult", () => function ValidationResult(items) { return { items }; });

const service = require("./validate-address");

describe("validate-address", () => {
    beforeEach(() => {
        mockPingProbe.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockPingProbe.mockRejectedValue(new Error("boom"));
        const result = await service({ address: "127.0.0.1", username: "u", password: "p" });
        expect(result).toBeDefined();
    });
});
