const mockConfigGet = jest.fn();

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/snmp-await", () => jest.fn().mockImplementation(() => ({ set: jest.fn(), close: jest.fn() })));
jest.mock("@core/mongo-collection", () => jest.fn());
jest.mock("@services/device-setpending", () => jest.fn());
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfacePoe = require("./interface-poe");

describe("interface-poe", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfacePoe(null, "enable")).rejects.toThrow("interfaceId is required");
    });

    test("rejects when action is invalid", async () => {
        await expect(interfacePoe(1, "bad")).rejects.toThrow("invalid action");
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(interfacePoe(1, "enable")).rejects.toThrow("failed to load config");
    });
});