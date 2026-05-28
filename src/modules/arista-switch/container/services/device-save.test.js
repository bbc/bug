const mockConfigGet = jest.fn();
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./device-save");

describe("device-save", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
