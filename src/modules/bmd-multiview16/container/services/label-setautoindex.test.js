const mockConfigGet = jest.fn();
const mockConfigPut = jest.fn();

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-putviacore", () => (...args) => mockConfigPut(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./label-setautoindex");

describe("label-setautoindex", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPut.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(undefined);
        await expect(service(0, 2)).rejects.toThrow("failed to load config");
    });

    test("sets the router index for an input and persists config", async () => {
        mockConfigGet.mockResolvedValue({});
        mockConfigPut.mockResolvedValue(true);

        await expect(service(0, 5)).resolves.toBe(true);

        expect(mockConfigPut).toHaveBeenCalledWith({ autoLabelIndex: { 0: 5 } });
    });

    test("removes the router index when routerIndex is undefined", async () => {
        mockConfigGet.mockResolvedValue({ autoLabelIndex: { 0: 5 } });
        mockConfigPut.mockResolvedValue(true);

        await expect(service(0, undefined)).resolves.toBe(true);

        expect(mockConfigPut).toHaveBeenCalledWith({ autoLabelIndex: {} });
    });

    test("throws when removing an input that is not present", async () => {
        mockConfigGet.mockResolvedValue({ autoLabelIndex: {} });
        await expect(service(3, undefined)).rejects.toThrow("input 3 not found");
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service(0, 5)).rejects.toBeDefined();
    });
});
