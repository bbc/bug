const mockSpeedtest = jest.fn();
const mockLoggerError = jest.fn();
const mockLoggerDebug = jest.fn();
const mockMongoSingleGet = jest.fn();
const mockMongoSingleSet = jest.fn();

jest.mock("../utils/speedtest", () => (...args) => mockSpeedtest(...args));
jest.mock("@core/logger", () => () => ({ error: (...args) => mockLoggerError(...args), debug: (...args) => mockLoggerDebug(...args) }));
jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
    set: (...args) => mockMongoSingleSet(...args),
}));

const testStart = require("./test-start");

describe("test-start service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("starts speedtest and returns running response when periodic testing is disabled", async () => {
        mockMongoSingleGet.mockResolvedValue(null);

        const result = await testStart();

        expect(mockSpeedtest).toHaveBeenCalledTimes(1);
        expect(mockMongoSingleSet).not.toHaveBeenCalled();
        expect(result).toEqual({
            data: { running: true },
            message: "Speedtest started",
        });
    });

    test("resets periodic timer when manual test is started during periodic mode", async () => {
        const schedule = {
            periodicTesting: true,
            interval: 15,
            nextRunAt: "2026-06-18T12:00:00.000Z",
            scheduleState: "waiting",
        };
        mockMongoSingleGet.mockResolvedValue(schedule);
        mockMongoSingleSet.mockResolvedValue();

        const result = await testStart();

        expect(mockMongoSingleGet).toHaveBeenCalledWith("test-schedule");
        expect(mockMongoSingleSet).toHaveBeenCalledWith("test-schedule", expect.objectContaining({
            periodicTesting: true,
            interval: 15,
            scheduleState: "waiting",
        }));
        expect(mockMongoSingleSet.mock.calls[0][1].nextRunAt).toBeDefined();
        expect(result).toEqual({
            data: { running: true },
            message: "Speedtest started",
        });
    });

    test("returns error object when speedtest throws synchronously", async () => {
        const error = new Error("failed");
        mockMongoSingleGet.mockResolvedValue(null);
        mockSpeedtest.mockImplementation(() => {
            throw error;
        });

        const result = await testStart();

        expect(result).toEqual({ error });
    });

    test("logs async speedtest failures without changing the immediate response", async () => {
        const error = new Error("async failed");
        mockMongoSingleGet.mockResolvedValue(null);
        mockSpeedtest.mockRejectedValue(error);

        const result = await testStart();
        await Promise.resolve();

        expect(result).toEqual({
            data: { running: true },
            message: "Speedtest started",
        });
        expect(mockLoggerError).toHaveBeenCalledWith("speedtest failed: async failed");
    });
});
