const mockMongoCollection = jest.fn();
const mockMongoSingleGet = jest.fn();
const mockTestStatusClean = jest.fn();

jest.mock("../utils/speedtest", () => jest.fn());
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));
jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoSingleGet(...args) }));
jest.mock("./test-status-clean", () => (...args) => mockTestStatusClean(...args));

const testResults = require("./test-results");

describe("test-results service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns result list limited by parsed value", async () => {
        const toArray = jest.fn().mockResolvedValue([
            {
                id: 1,
                interface: { externalIp: "1.2.3.4" },
                server: { name: "London" },
                isp: "BBC ISP",
            },
        ]);
        const limit = jest.fn(() => ({ toArray }));
        const find = jest.fn(() => ({ limit }));
        mockMongoCollection.mockResolvedValue({ find });
        mockMongoSingleGet.mockResolvedValue(null);
        mockTestStatusClean.mockResolvedValue(null);

        const result = await testResults("7");

        expect(mockMongoCollection).toHaveBeenCalledWith("test-results");
        expect(mockTestStatusClean).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith({}, { sort: { timestamp: -1 } });
        expect(limit).toHaveBeenCalledWith(7);
        expect(result).toEqual([
            {
                id: 1,
                interface: { externalIp: "1.2.3.4" },
                server: { name: "London" },
                isp: "BBC ISP",
                testSummary: "Test from 1.2.3.4 to London using ISP BBC ISP",
            },
        ]);
    });

    test("throws when query fails", async () => {
        const error = new Error("db down");
        mockMongoCollection.mockRejectedValue(error);

        await expect(testResults()).rejects.toThrow("db down");
    });

    test("prepends scheduled status row when periodic test is scheduled", async () => {
        const toArray = jest.fn().mockResolvedValue([]);
        const limit = jest.fn(() => ({ toArray }));
        const find = jest.fn(() => ({ limit }));
        mockMongoCollection.mockResolvedValue({ find });
        mockTestStatusClean.mockResolvedValue(null);
        mockMongoSingleGet.mockResolvedValue({
            periodicTesting: true,
            nextRunAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            scheduleState: "waiting",
        });

        const result = await testResults("10");

        expect(result[0]).toEqual(
            expect.objectContaining({
                statusRowType: "scheduled",
            })
        );
        expect(result[0].testSummary).toMatch(/^Next test starting in \d{2}:\d{2}$/);
    });

    test("prepends running status row with elapsed time when a test is running", async () => {
        const toArray = jest.fn().mockResolvedValue([
            {
                id: 1,
                running: true,
                timestamp: new Date(Date.now() - 45 * 1000).toISOString(),
            },
        ]);
        const limit = jest.fn(() => ({ toArray }));
        const find = jest.fn(() => ({ limit }));
        mockMongoCollection.mockResolvedValue({ find });
        mockTestStatusClean.mockResolvedValue(null);
        mockMongoSingleGet.mockResolvedValue({ periodicTesting: true, scheduleState: "running" });

        const result = await testResults("10");

        expect(result[0]).toEqual(
            expect.objectContaining({
                statusRowType: "running",
            })
        );
        expect(result[0].testSummary).toMatch(/^Test running \d{2}:\d{2}$/);
        expect(result).toHaveLength(1);
    });

    test("hides transient running result rows from table body", async () => {
        const toArray = jest.fn().mockResolvedValue([
            {
                id: 1,
                running: true,
                timestamp: new Date(Date.now() - 30 * 1000).toISOString(),
            },
            {
                id: 2,
                running: false,
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                interface: { externalIp: "1.2.3.4" },
                server: { name: "London" },
                isp: "BBC ISP",
            },
        ]);
        const limit = jest.fn(() => ({ toArray }));
        const find = jest.fn(() => ({ limit }));
        mockMongoCollection.mockResolvedValue({ find });
        mockTestStatusClean.mockResolvedValue(null);
        mockMongoSingleGet.mockResolvedValue({ periodicTesting: true, scheduleState: "running" });

        const result = await testResults("10");

        expect(result[0]).toEqual(
            expect.objectContaining({
                statusRowType: "running",
            })
        );
        expect(result[1]).toEqual(
            expect.objectContaining({
                id: 2,
                testSummary: "Test from 1.2.3.4 to London using ISP BBC ISP",
            })
        );
        expect(result.find((item) => item.id === 1)).toBeUndefined();
    });

    test("shows scheduled status when latest running result is stale", async () => {
        const toArray = jest.fn().mockResolvedValue([
            {
                id: 1,
                running: true,
                timestamp: new Date(Date.now() - 90 * 1000).toISOString(),
            },
        ]);
        const limit = jest.fn(() => ({ toArray }));
        const find = jest.fn(() => ({ limit }));
        mockMongoCollection.mockResolvedValue({ find });
        mockTestStatusClean.mockResolvedValue(null);
        mockMongoSingleGet.mockResolvedValue({
            periodicTesting: true,
            nextRunAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            scheduleState: "waiting",
        });

        const result = await testResults("10");

        expect(result[0]).toEqual(
            expect.objectContaining({
                statusRowType: "scheduled",
            })
        );
        expect(result[0].testSummary).toMatch(/^Next test starting in \d{2}:\d{2}$/);
    });

});
