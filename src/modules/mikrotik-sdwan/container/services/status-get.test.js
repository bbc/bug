const mockStatusCheckMongoSingle = jest.fn();
const mockStatusCheckHeartbeat = jest.fn();
const mockStatusCheckEntries = jest.fn();
const mockStatusCheckSystem = jest.fn();

jest.mock("@core/status-checkmongosingle", () => (...args) => mockStatusCheckMongoSingle(...args));
jest.mock("@core/heartbeat", () => ({
    statusCheckHeartbeat: (...args) => mockStatusCheckHeartbeat(...args),
}));
jest.mock("./status-checkentries", () => (...args) => mockStatusCheckEntries(...args));
jest.mock("./status-checksystem", () => (...args) => mockStatusCheckSystem(...args));

const statusGet = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        mockStatusCheckMongoSingle.mockReset();
        mockStatusCheckHeartbeat.mockReset();
        mockStatusCheckEntries.mockReset();
        mockStatusCheckSystem.mockReset();
    });

    test("rejects when a dependency throws", async () => {
        mockStatusCheckMongoSingle
            .mockResolvedValueOnce([])
            .mockRejectedValueOnce(new Error("status check failed"));

        await expect(statusGet()).rejects.toThrow("status check failed");
    });

    test("returns concatenated status array", async () => {
        mockStatusCheckMongoSingle
            .mockResolvedValueOnce(["a"])
            .mockResolvedValueOnce(["b"])
            .mockResolvedValueOnce(["c"]);
        mockStatusCheckSystem.mockResolvedValue(["d"]);
        mockStatusCheckEntries.mockResolvedValue(["e"]);
        mockStatusCheckHeartbeat.mockResolvedValue(["f"]);

        await expect(statusGet()).resolves.toEqual(["a", "b", "c", "d", "e", "f"]);
    });
});
