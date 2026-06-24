const mockConfigGet = jest.fn();

jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@utils/ciscosg-ssh", () => jest.fn(async () => ["OK"]));
jest.mock("@core/mongo-collection", () => jest.fn());
jest.mock("@core/mongo-single", () => ({ get: jest.fn(async () => []) }));
jest.mock("@utils/ciscosg-vlanarray", () => jest.fn(() => []));
jest.mock("@utils/ciscosg-vlanranges", () => jest.fn(() => []));
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
