const mockStatusCheckCollection = jest.fn();
const mockStatusCheckHeartbeat = jest.fn();
const mockStatusCheckEntries = jest.fn();

jest.mock("@core/status-checkcollection", () => (...args) => mockStatusCheckCollection(...args));
jest.mock("@core/heartbeat", () => ({
    statusCheckHeartbeat: (...args) => mockStatusCheckHeartbeat(...args),
}));
jest.mock("./status-checkentries", () => (...args) => mockStatusCheckEntries(...args));

const statusGet = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        mockStatusCheckCollection.mockReset();
        mockStatusCheckHeartbeat.mockReset();
        mockStatusCheckEntries.mockReset();
    });

    test("rejects when a dependency throws", async () => {
        mockStatusCheckCollection.mockRejectedValue(new Error("status check failed"));

        await expect(statusGet()).rejects.toThrow("status check failed");
    });

    test("returns concatenated status array", async () => {
        mockStatusCheckCollection.mockResolvedValue(["a"]);
        mockStatusCheckEntries.mockResolvedValue(["b"]);
        mockStatusCheckHeartbeat.mockResolvedValue(["c"]);

        await expect(statusGet()).resolves.toEqual(["a", "b", "c"]);
    });
});
