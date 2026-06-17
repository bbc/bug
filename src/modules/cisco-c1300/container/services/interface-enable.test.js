const mockSet = jest.fn();
const mockClose = jest.fn();

jest.mock("@core/snmp-await", () => {
    return jest.fn().mockImplementation(() => ({
        set: mockSet,
        close: mockClose,
    }));
});

const mockConfigGet = jest.fn();
const mockMongoCollection = jest.fn();
const mockDeviceSetPending = jest.fn(async () => undefined);

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@services/device-setpending", () => mockDeviceSetPending);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceEnable = require("./interface-enable");

describe("interface-enable exception handling", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockMongoCollection.mockReset();
        mockDeviceSetPending.mockClear();
        mockSet.mockReset();
        mockClose.mockReset();
    });

    test("rejects when config-get throws", async () => {
        mockConfigGet.mockRejectedValue(new Error("config exploded"));

        await expect(interfaceEnable(10)).rejects.toThrow("config exploded");
    });

    test("rejects when db update match count is not 1", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1", snmpCommunity: "public" });
        mockSet.mockResolvedValue(undefined);
        mockMongoCollection.mockResolvedValue({
            updateOne: jest.fn(async () => ({ matchedCount: 0 })),
        });

        await expect(interfaceEnable(10)).rejects.toThrow("expected to update 1 interface in DB");
        expect(mockClose).toHaveBeenCalledTimes(1);
    });
});
