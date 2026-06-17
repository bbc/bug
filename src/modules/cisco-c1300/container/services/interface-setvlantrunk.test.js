const mockConfigGet = jest.fn();

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/snmp-await", () => jest.fn().mockImplementation(() => ({ set: jest.fn(), close: jest.fn() })));
jest.mock("@core/mongo-collection", () => jest.fn());
jest.mock("@core/mongo-single", () => ({ get: jest.fn(async () => []) }));
jest.mock("@utils/ciscoc1300-vlanarray", () => jest.fn(() => []));
jest.mock("@utils/ciscoc1300-vlanlist", () => ({ encode: jest.fn(() => []) }));
jest.mock("@services/device-setpending", () => jest.fn());
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceSetVlanTrunk = require("./interface-setvlantrunk");

describe("interface-setvlantrunk", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceSetVlanTrunk()).rejects.toThrow("interfaceId is required");
    });

    test("rejects when taggedVlans is not an array", async () => {
        await expect(interfaceSetVlanTrunk(1, 1, "bad")).rejects.toThrow("taggedVlans must be an array");
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(interfaceSetVlanTrunk(1, 1, [])).rejects.toThrow("failed to load config");
    });
});
