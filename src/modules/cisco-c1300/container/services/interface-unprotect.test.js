const mockConfigGet = jest.fn();
const mockConfigPutViaCore = jest.fn();

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/config-putviacore", () => mockConfigPutViaCore);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceUnprotect = require("./interface-unprotect");

describe("interface-unprotect", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPutViaCore.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceUnprotect()).rejects.toThrow("interfaceId is required");
    });

    test("returns false when interface is not protected", async () => {
        mockConfigGet.mockResolvedValue({ protectedInterfaces: ["2"] });
        await expect(interfaceUnprotect("1")).resolves.toBe(false);
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("updates config when interface is protected", async () => {
        mockConfigGet.mockResolvedValue({ protectedInterfaces: ["1", "2"] });
        mockConfigPutViaCore.mockResolvedValue({ updated: true });

        await expect(interfaceUnprotect("1")).resolves.toEqual({ updated: true });
    });
});
