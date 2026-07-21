const mockMongoGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./deviceconfig-list");

describe("deviceconfig-list", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("parses string booleans and passes other values through", async () => {
        mockMongoGet.mockResolvedValue({ border: "true", audio: "false", layout: "3x3" });
        await expect(service()).resolves.toEqual({ border: true, audio: false, layout: "3x3" });
    });

    test("returns an empty object when there is no config", async () => {
        mockMongoGet.mockResolvedValue(undefined);
        await expect(service()).resolves.toEqual({});
    });

    test("handles dependency exceptions", async () => {
        mockMongoGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
