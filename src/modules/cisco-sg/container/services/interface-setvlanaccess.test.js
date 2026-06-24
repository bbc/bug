const mockConfigGet = jest.fn();

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@utils/ciscosg-ssh", () => jest.fn(async () => ["OK"]));
jest.mock("@core/mongo-collection", () => jest.fn());
jest.mock("@core/mongo-single", () => ({ get: jest.fn(async () => ({ "control-version": 1 })) }));
jest.mock("@services/device-setpending", () => jest.fn());
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceSetVlanAccess = require("./interface-setvlanaccess");

describe("interface-setvlanaccess", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceSetVlanAccess()).rejects.toThrow("interfaceId is required");
    });

    test("rejects when untaggedVlan is missing", async () => {
        await expect(interfaceSetVlanAccess(1, null)).rejects.toThrow("untaggedVlan is required");
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(interfaceSetVlanAccess(1, "10")).rejects.toThrow("failed to load config");
    });
});
