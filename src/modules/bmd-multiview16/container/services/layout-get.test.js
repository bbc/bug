const mockConfigGet = jest.fn();
const mockDeviceConfigList = jest.fn();
const mockSourceList = jest.fn();
const mockRouteList = jest.fn();

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("./deviceconfig-list", () => (...args) => mockDeviceConfigList(...args));
jest.mock("./source-list", () => (...args) => mockSourceList(...args));
jest.mock("./route-list", () => (...args) => mockRouteList(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./layout-get");

describe("layout-get", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockDeviceConfigList.mockReset();
        mockSourceList.mockReset();
        mockRouteList.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(undefined);
        await expect(service()).rejects.toThrow("failed to load config");
    });

    test("builds a grid of cells from routes, sources and device config", async () => {
        mockConfigGet.mockResolvedValue({});
        mockDeviceConfigList.mockResolvedValue({ layout: "2x2", solo_enabled: false });
        mockSourceList.mockResolvedValue(["A", "B", "C", "D"]);
        mockRouteList.mockResolvedValue([0, 1, 2, 3]);

        const result = await service();

        expect(result).toHaveLength(2);
        expect(result[0][0]).toEqual({
            outputIndex: 0,
            inputIndex: 0,
            inputLabel: "A",
            soloSelected: false,
            audioSelected: false,
        });
        expect(result[1][1]).toEqual({
            outputIndex: 3,
            inputIndex: 3,
            inputLabel: "D",
            soloSelected: false,
            audioSelected: false,
        });
    });

    test("returns an empty array when device config has no layout", async () => {
        mockConfigGet.mockResolvedValue({});
        mockDeviceConfigList.mockResolvedValue({});
        mockSourceList.mockResolvedValue([]);
        mockRouteList.mockResolvedValue([]);

        await expect(service()).resolves.toEqual([]);
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
