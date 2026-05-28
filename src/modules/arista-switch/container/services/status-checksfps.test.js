const mockCollection = jest.fn();
jest.mock("@core/mongo-collection", () => (...args) => mockCollection(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@core/StatusItem", () => function StatusItem(value) { return value; });

const service = require("./status-checksfps");

describe("status-checksfps", () => {
    beforeEach(() => {
        mockCollection.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockCollection.mockRejectedValue(new Error("boom"));
        await expect(service()).resolves.toBeDefined();
    });
});
