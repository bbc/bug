const mockStatusCheckCollection = jest.fn();
const mockStatusGetDefault = jest.fn();
const mockStatusCheckHeartbeat = jest.fn();

jest.mock("@core/status-checkcollection", () => (...args) => mockStatusCheckCollection(...args));
jest.mock("./status-getdefault", () => (...args) => mockStatusGetDefault(...args));
jest.mock("@core/heartbeat", () => ({ statusCheckHeartbeat: (...args) => mockStatusCheckHeartbeat(...args) }));

const service = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        mockStatusCheckCollection.mockReset();
        mockStatusGetDefault.mockReset();
        mockStatusCheckHeartbeat.mockReset();
    });

    test("loads without syntax errors", () => {
        expect(() => require("./status-get")).not.toThrow();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("combines heartbeat, collection, and default status results", async () => {
        mockStatusCheckHeartbeat.mockResolvedValue(["heartbeat"]);
        mockStatusCheckCollection.mockResolvedValue(["collection"]);
        mockStatusGetDefault.mockResolvedValue(["default"]);

        await expect(service()).resolves.toEqual(["heartbeat", "collection", "default"]);
        expect(mockStatusCheckHeartbeat).toHaveBeenCalledWith({ timeout: 10 });
    });
});
