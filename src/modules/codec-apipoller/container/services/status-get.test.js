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

    test("aggregates default status and heartbeat checks", async () => {
        const defaultItem = { key: "defaultservice", message: "ready", type: "default" };
        const criticalItem = { key: "stalecodecs", message: ["stale"], type: "critical" };
        mockStatusGetDefault.mockResolvedValue(defaultItem);
        mockStatusCheckMongoSingle.mockResolvedValue(criticalItem);

        const result = await service();

        expect(mockStatusGetDefault).toHaveBeenCalledTimes(1);
        expect(mockStatusCheckMongoSingle).toHaveBeenCalledWith({
            collectionName: "codecs",
            message: ["There is no recent codec data for this service.", "Check your settings."],
            itemType: "critical",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        });
        expect(result).toEqual([defaultItem, criticalItem]);
    });

    test("returns empty array when a status dependency throws", async () => {
        mockStatusGetDefault.mockRejectedValue(new Error("boom"));

        const result = await service();

        expect(mockLoggerError).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
    });
});