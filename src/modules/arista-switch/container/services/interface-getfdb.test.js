const mockCollection = jest.fn();
jest.mock("@core/mongo-collection", () => (...args) => mockCollection(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@core/sort-handlers", () => ({ number: () => 0, string: () => 0, ipAddress: () => 0 }));

const service = require("./interface-getfdb");

describe("interface-getfdb", () => {
    beforeEach(() => {
        mockCollection.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockCollection.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
