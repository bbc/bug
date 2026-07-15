const mockStatusCheckMongoSingle = jest.fn();
const mockStatusGetDefault = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("@core/status-checkmongosingle", () => (...args) => mockStatusCheckMongoSingle(...args));
jest.mock("@services/status-getdefault", () => (...args) => mockStatusGetDefault(...args));
jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
}));

const service = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns default status only", async () => {
        const defaultItem = { key: "defaultservice", message: "ready", type: "default" };
        mockStatusGetDefault.mockResolvedValue(defaultItem);

        const result = await service();

        expect(mockStatusGetDefault).toHaveBeenCalledTimes(1);
        expect(mockStatusCheckMongoSingle).not.toHaveBeenCalled();
        expect(result).toEqual([defaultItem]);
    });

    test("returns empty array when a status dependency throws", async () => {
        mockStatusGetDefault.mockRejectedValue(new Error("boom"));

        const result = await service();

        expect(mockLoggerError).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
    });
});