const mockStatusCheckCollection = jest.fn();
jest.mock("@core/status-checkcollection", () => (...args) => mockStatusCheckCollection(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@services/status-checkpending", () => jest.fn(async () => ([])));
jest.mock("@services/status-checkinterfacestatus", () => jest.fn(async () => ([])));
jest.mock("@services/status-checksfps", () => jest.fn(async () => ([])));
jest.mock("@services/status-checkpower", () => jest.fn(async () => ([])));
jest.mock("@services/status-checktemperature", () => jest.fn(async () => ([])));
jest.mock("@services/status-getsystem", () => jest.fn(async () => ([])));

const service = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        mockStatusCheckCollection.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockStatusCheckCollection.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
