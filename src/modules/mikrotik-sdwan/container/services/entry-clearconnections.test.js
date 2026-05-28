const mockConfigGet = jest.fn();
const mockRun = jest.fn();
const mockRouterOSApi = jest.fn().mockImplementation(() => ({
    run: (...args) => mockRun(...args),
}));

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/routeros-api", () => mockRouterOSApi);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const entryClearConnections = require("./entry-clearconnections");

describe("entry-clearconnections", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockRun.mockReset();
        mockRouterOSApi.mockClear();
    });

    test("throws when address is missing", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });

        await expect(entryClearConnections()).rejects.toThrow("no address provided");
    });

    test("clears unique connections for an address", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockRun
            .mockResolvedValueOnce([{ id: "1", ".id": "*1" }])
            .mockResolvedValueOnce([{ id: "1", ".id": "*1" }])
            .mockResolvedValueOnce(true);

        await expect(entryClearConnections("10.0.0.10")).resolves.toBe(true);
        expect(mockRun).toHaveBeenCalledWith("/ip/firewall/connection/remove", ["=numbers=*1"]);
    });
});
