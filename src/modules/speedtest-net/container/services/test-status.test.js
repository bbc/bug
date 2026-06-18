const mockTestStatusClean = jest.fn();
const mockMongoSingleGet = jest.fn();

jest.mock("../utils/speedtest", () => jest.fn());
jest.mock("./test-status-clean", () => (...args) => mockTestStatusClean(...args));
jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoSingleGet(...args) }));

const testStatus = require("./test-status");

describe("test-status service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns latest test result", async () => {
        mockTestStatusClean.mockResolvedValue({ running: false });
        mockMongoSingleGet.mockResolvedValue({ periodicTesting: false, scheduleState: "idle" });

        const result = await testStatus();

        expect(mockTestStatusClean).toHaveBeenCalledWith();
        expect(mockMongoSingleGet).toHaveBeenCalledWith("test-schedule");
        expect(result).toEqual({
            data: {
                periodicTesting: false,
                scheduleState: "idle",
                running: false,
            },
        });
    });

    test("returns scheduler state when no test result exists yet", async () => {
        mockTestStatusClean.mockResolvedValue(null);
        mockMongoSingleGet.mockResolvedValue({
            periodicTesting: true,
            interval: 10,
            nextRunAt: "2026-06-18T12:00:00.000Z",
            scheduleState: "waiting",
        });

        const result = await testStatus();

        expect(result).toEqual({
            data: {
                periodicTesting: true,
                interval: 10,
                nextRunAt: "2026-06-18T12:00:00.000Z",
                scheduleState: "waiting",
            },
        });
    });

    test("returns error when database lookup fails", async () => {
        const error = new Error("db down");
        mockTestStatusClean.mockRejectedValue(error);

        const result = await testStatus();

        expect(result).toEqual({ error });
    });
});
