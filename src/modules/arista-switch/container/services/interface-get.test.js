const mockCollection = jest.fn();
jest.mock("@core/mongo-collection", () => (...args) => mockCollection(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./interface-get");

describe("interface-get", () => {
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
