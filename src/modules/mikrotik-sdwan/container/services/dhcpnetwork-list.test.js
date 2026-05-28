const mockGet = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
}));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const dhcpNetworkList = require("./dhcpnetwork-list");

describe("dhcpnetwork-list", () => {
    beforeEach(() => {
        mockGet.mockReset();
    });

    test("returns empty array when database value is missing", async () => {
        mockGet.mockResolvedValue(null);

        await expect(dhcpNetworkList()).resolves.toEqual([]);
    });

    test("throws when database value is malformed", async () => {
        mockGet.mockResolvedValue({ bad: true });

        await expect(dhcpNetworkList()).rejects.toThrow("dhcp network data in database is malformed");
    });
});
