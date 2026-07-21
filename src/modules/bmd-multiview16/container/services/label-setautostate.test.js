const mockConfigGet = jest.fn();
const mockConfigPut = jest.fn();

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-putviacore", () => (...args) => mockConfigPut(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./label-setautostate");

describe("label-setautostate", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPut.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(undefined);
        await expect(service(0, true)).rejects.toThrow("failed to load config");
    });

    test("enables autolabel for an input and persists config", async () => {
        mockConfigGet.mockResolvedValue({});
        mockConfigPut.mockResolvedValue(true);

        await expect(service(0, true)).resolves.toBe(true);

        expect(mockConfigPut).toHaveBeenCalledWith({ autoLabelEnabled: [0] });
    });

    test("returns false when enabling an already-enabled input", async () => {
        mockConfigGet.mockResolvedValue({ autoLabelEnabled: [0] });
        await expect(service(0, true)).resolves.toBe(false);
        expect(mockConfigPut).not.toHaveBeenCalled();
    });

    test("disables autolabel for an input and persists config", async () => {
        mockConfigGet.mockResolvedValue({ autoLabelEnabled: [0, 1] });
        mockConfigPut.mockResolvedValue(true);

        await expect(service(0, false)).resolves.toBe(true);

        expect(mockConfigPut).toHaveBeenCalledWith({ autoLabelEnabled: [1] });
    });

    test("returns false when disabling an input that is not enabled", async () => {
        mockConfigGet.mockResolvedValue({ autoLabelEnabled: [] });
        await expect(service(0, false)).resolves.toBe(false);
        expect(mockConfigPut).not.toHaveBeenCalled();
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service(0, true)).rejects.toBeDefined();
    });
});
