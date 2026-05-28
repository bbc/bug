const mockGet = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
}));
jest.mock("@core/sort-handlers", () => ({
    string: () => 0,
    ipAddress: () => 0,
}));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const dhcpLeaseList = require("./dhcplease-list");

describe("dhcplease-list", () => {
    beforeEach(() => {
        mockGet.mockReset();
    });

    test("returns empty array when database value is missing", async () => {
        mockGet.mockResolvedValue(null);

        await expect(dhcpLeaseList()).resolves.toEqual([]);
    });

    test("throws when database value is malformed", async () => {
        mockGet.mockResolvedValue({ bad: true });

        await expect(dhcpLeaseList()).rejects.toThrow("dhcp lease data in database is malformed");
    });
});
