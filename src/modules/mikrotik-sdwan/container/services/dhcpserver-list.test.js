const mockGet = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
}));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const dhcpServerList = require("./dhcpserver-list");

describe("dhcpserver-list", () => {
    beforeEach(() => {
        mockGet.mockReset();
    });

    test("returns empty array when database value is missing", async () => {
        mockGet.mockResolvedValue(undefined);

        await expect(dhcpServerList()).resolves.toEqual([]);
    });

    test("throws when database value is malformed", async () => {
        mockGet.mockResolvedValue({ bad: true });

        await expect(dhcpServerList()).rejects.toThrow("dhcpServers data is malformed");
    });
});
