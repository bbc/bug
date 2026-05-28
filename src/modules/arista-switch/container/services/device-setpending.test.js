const mockMongoSet = jest.fn();
jest.mock("@core/mongo-single", () => ({ set: (...args) => mockMongoSet(...args) }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./device-setpending");

describe("device-setpending", () => {
    beforeEach(() => {
        mockMongoSet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockMongoSet.mockImplementation(() => { throw new Error("boom"); });
        await expect(service()).rejects.toBeDefined();
    });
});
