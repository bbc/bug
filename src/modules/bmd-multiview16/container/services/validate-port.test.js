const mockVideohubTest = jest.fn();

jest.mock("@services/videohub-test", () => (...args) => mockVideohubTest(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@core/ValidationResult", () => function ValidationResult(items) { return { items }; });

const service = require("./validate-port");

describe("validate-port", () => {
    beforeEach(() => {
        mockVideohubTest.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("returns success payload when videohub-test passes", async () => {
        mockVideohubTest.mockResolvedValue(true);
        const result = await service({ address: "127.0.0.1", port: 9990 });
        expect(result.items[0]).toHaveProperty("state", true);
    });

    test("returns failure payload when videohub-test fails", async () => {
        mockVideohubTest.mockResolvedValue(false);
        const result = await service({ address: "127.0.0.1", port: 9990 });
        expect(result.items[0]).toHaveProperty("state", false);
    });
});
