const mockMongoGet = jest.fn();
const mockConfigGet = jest.fn();
const mockCommentParse = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoGet(...args),
}));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@utils/comment-parser", () => ({
    parse: (...args) => mockCommentParse(...args),
}));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const entryList = require("./entry-list");

describe("entry-list", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
        mockConfigGet.mockReset();
        mockCommentParse.mockReset();
    });

    test("rejects when config is missing", async () => {
        mockMongoGet.mockResolvedValue([]);
        mockConfigGet.mockResolvedValue(null);

        await expect(entryList()).rejects.toThrow("failed to retrieve system configuration");
    });

    test("returns grouped entries", async () => {
        mockMongoGet
            .mockResolvedValueOnce([
                { id: "1", address: "10.0.0.10", list: "none", comment: "[bug_sdwan] a" },
            ])
            .mockResolvedValueOnce([
                { address: "10.0.0.10", macAddress: "aa:bb", server: "dhcp1", dynamic: false },
            ]);

        mockConfigGet.mockResolvedValue({ lockedEntries: [] });
        mockCommentParse.mockReturnValue({ group: "office", label: "entry 1" });

        const result = await entryList();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("group", "OFFICE");
        expect(result[0].items).toHaveLength(1);
    });
});
