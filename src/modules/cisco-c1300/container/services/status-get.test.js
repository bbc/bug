const mockStatusCheckCollection = jest.fn();
const mockStatusCheckPending = jest.fn();
const mockStatusCheckPasswordExpired = jest.fn();
const mockStatusCheckConfig = jest.fn();
const mockStatusGetSystem = jest.fn();
const mockStatusCheckHeartbeat = jest.fn();

jest.mock("@core/status-checkcollection", () => mockStatusCheckCollection);
jest.mock("@services/status-checkpending", () => mockStatusCheckPending);
jest.mock("@services/status-checkpasswordexpired", () => mockStatusCheckPasswordExpired);
jest.mock("@core/status-checkconfig", () => mockStatusCheckConfig);
jest.mock("@services/status-getsystem", () => mockStatusGetSystem);
jest.mock("@core/heartbeat", () => ({ statusCheckHeartbeat: (...args) => mockStatusCheckHeartbeat(...args) }));

const statusGet = require("./status-get");

describe("status-get exception handling", () => {
    beforeEach(() => {
        mockStatusCheckCollection.mockReset();
        mockStatusCheckPending.mockReset();
        mockStatusCheckPasswordExpired.mockReset();
        mockStatusCheckConfig.mockReset();
        mockStatusGetSystem.mockReset();
        mockStatusCheckHeartbeat.mockReset();
    });

    test("rejects when a dependency throws", async () => {
        mockStatusCheckHeartbeat.mockResolvedValue([]);
        mockStatusCheckCollection
            .mockResolvedValueOnce([])
            .mockRejectedValueOnce(new Error("collection exploded"));

        await expect(statusGet()).rejects.toThrow("collection exploded");
    });

    test("returns concatenated data when all dependencies succeed", async () => {
        mockStatusCheckHeartbeat.mockResolvedValue(["h"]);
        mockStatusCheckCollection.mockResolvedValueOnce(["a"]).mockResolvedValueOnce(["b"]).mockResolvedValueOnce(["c"]);
        mockStatusCheckPending.mockResolvedValue(["d"]);
        mockStatusCheckPasswordExpired.mockResolvedValue(["e"]);
        mockStatusCheckConfig.mockResolvedValue(["f"]);
        mockStatusGetSystem.mockResolvedValue(["g"]);

        await expect(statusGet()).resolves.toEqual(["h", "a", "b", "c", "d", "e", "f", "g"]);
        expect(mockStatusCheckHeartbeat).toHaveBeenCalledWith({ timeout: 10 });
    });
});
