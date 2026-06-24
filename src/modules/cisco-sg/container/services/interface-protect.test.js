const mockConfigGet = jest.fn();
const mockConfigPutViaCore = jest.fn();

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/config-putviacore", () => mockConfigPutViaCore);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceProtect = require("./interface-protect");

describe("interface-protect exception handling", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPutViaCore.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceProtect()).rejects.toThrow("interfaceId is required");
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(interfaceProtect("1")).rejects.toThrow("failed to load config");
    });

    test("returns undefined when interface is already protected", async () => {
        mockConfigGet.mockResolvedValue({ protectedInterfaces: ["1"] });

        await expect(interfaceProtect("1")).resolves.toBeUndefined();
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("persists updated config when interface is not protected", async () => {
        const config = { protectedInterfaces: ["2"] };
        mockConfigGet.mockResolvedValue(config);
        mockConfigPutViaCore.mockResolvedValue({ updated: true });

        await expect(interfaceProtect("1")).resolves.toEqual({ updated: true });
        expect(mockConfigPutViaCore).toHaveBeenCalledWith({ protectedInterfaces: ["2", "1"] });
    });
});
