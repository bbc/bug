const mockStatusCheckHeartbeat = jest.fn(async () => ([{ key: "heartbeat" }]));
const mockStatusGetDefault = jest.fn(async () => ({ key: "defaultservice" }));

jest.mock("@core/heartbeat", () => ({
    statusCheckHeartbeat: (...args) => mockStatusCheckHeartbeat(...args),
}));
jest.mock("@services/status-getdefault", () => (...args) => mockStatusGetDefault(...args));

const service = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        mockStatusCheckHeartbeat.mockClear();
        mockStatusGetDefault.mockClear();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("combines heartbeat and default status results", async () => {
        const result = await service();
        expect(mockStatusCheckHeartbeat).toHaveBeenCalledWith({ timeout: 10 });
        expect(mockStatusGetDefault).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ key: "heartbeat" }, { key: "defaultservice" }]);
    });
});
