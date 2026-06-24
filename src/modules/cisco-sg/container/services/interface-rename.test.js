const mockConfigGet = jest.fn();

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/snmp-await", () => jest.fn().mockImplementation(() => ({ set: jest.fn(), close: jest.fn() })));
jest.mock("@core/mongo-collection", () => jest.fn());
jest.mock("@services/device-setpending", () => jest.fn());
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceRename = require("./interface-rename");

describe("interface-rename", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceRename(null, "name")).rejects.toThrow("interfaceId is required");
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(interfaceRename(1, "name")).rejects.toThrow("failed to load config");
    });
});
