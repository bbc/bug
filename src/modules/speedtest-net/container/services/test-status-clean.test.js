const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const testStatusClean = require("./test-status-clean");

describe("test-status-clean service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns null when no test result exists", async () => {
        const findOne = jest.fn().mockResolvedValue(null);
        mockMongoCollection.mockResolvedValue({ findOne });

        const result = await testStatusClean();

        expect(result).toBeNull();
    });

    test("returns fresh test that is not stalled", async () => {
        const testDoc = { _id: "abc", running: false, timestamp: new Date().toISOString() };
        const findOne = jest.fn().mockResolvedValue(testDoc);
        mockMongoCollection.mockResolvedValue({ findOne });

        const result = await testStatusClean();

        expect(result).toEqual(testDoc);
    });

    test("detects and clears a stalled test (running for >60s)", async () => {
        const stalledDoc = {
            _id: "abc",
            running: true,
            timestamp: new Date(Date.now() - 90 * 1000).toISOString(), // 90 seconds ago
        };
        const clearedDoc = {
            _id: "abc",
            running: false,
            failed: true,
            timedOut: true,
            status: "failed",
            error: "Test did not complete within 60 seconds",
            timestamp: stalledDoc.timestamp,
        };

        const findOne = jest
            .fn()
            .mockResolvedValueOnce(stalledDoc) // First call finds stalled test
            .mockResolvedValueOnce(clearedDoc); // Second call returns corrected doc
        const updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
        mockMongoCollection.mockResolvedValue({ findOne, updateOne });

        const result = await testStatusClean();

        expect(updateOne).toHaveBeenCalledWith(
            { _id: "abc" },
            {
                $set: {
                    running: false,
                    failed: true,
                    timedOut: true,
                    status: "failed",
                    error: "Test did not complete within 60 seconds",
                },
            }
        );
        expect(result).toEqual(clearedDoc);
    });

    test("ignores tests marked running if they are less than 60s old", async () => {
        const recentDoc = {
            _id: "abc",
            running: true,
            timestamp: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
        };
        const findOne = jest.fn().mockResolvedValue(recentDoc);
        mockMongoCollection.mockResolvedValue({ findOne });

        const result = await testStatusClean();

        expect(result).toEqual(recentDoc);
    });
});
