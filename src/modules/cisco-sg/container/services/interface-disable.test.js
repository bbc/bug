const mockConfigGet = jest.fn();
const mockMongoCollection = jest.fn();
const mockDeviceSetPending = jest.fn(async () => undefined);
const mockSet = jest.fn();

jest.mock("@core/snmp-await", () => {
    return jest.fn().mockImplementation(() => ({ set: mockSet, close: jest.fn() }));
});
jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@services/device-setpending", () => mockDeviceSetPending);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceDisable = require("./interface-disable");

describe("interface-disable", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockMongoCollection.mockReset();
        mockDeviceSetPending.mockClear();
        mockSet.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceDisable()).rejects.toBeDefined();
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(interfaceDisable(10)).rejects.toBeDefined();
    });

    test("rejects when db update does not match one record", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1", snmpCommunity: "public" });
        mockSet.mockResolvedValue(undefined);
        mockMongoCollection.mockResolvedValue({
            updateOne: jest.fn(async () => ({ matchedCount: 0 })),
        });

        await expect(interfaceDisable(10)).rejects.toBeDefined();
    });
});
