jest.mock("@core/logger", () => () => ({
    error: jest.fn(),
}));

const mongoSaveArray = require("./mongo-savearray");

describe("mongo-savearray", () => {
    test("uses replaceOne bulk operations by default", async () => {
        const bulkWrite = jest.fn(async () => ({ modifiedCount: 2 }));
        const collection = { bulkWrite };
        const documents = [
            { name: "ether1", value: 10 },
            { name: "ether2", value: 20 },
        ];

        const result = await mongoSaveArray(collection, documents, "name");

        expect(result).toEqual({ modifiedCount: 2 });
        expect(bulkWrite).toHaveBeenCalledWith(
            [
                {
                    replaceOne: {
                        filter: { name: "ether1" },
                        replacement: documents[0],
                        upsert: true,
                    },
                },
                {
                    replaceOne: {
                        filter: { name: "ether2" },
                        replacement: documents[1],
                        upsert: true,
                    },
                },
            ],
            { ordered: false }
        );
    });

    test("uses updateOne bulk operations when update mode is enabled", async () => {
        const bulkWrite = jest.fn(async () => ({ upsertedCount: 1 }));

        await mongoSaveArray({ bulkWrite }, [{ id: "*1", disabled: false }], "id", true);

        expect(bulkWrite).toHaveBeenCalledWith(
            [
                {
                    updateOne: {
                        filter: { id: "*1" },
                        update: { $set: { id: "*1", disabled: false } },
                        upsert: true,
                    },
                },
            ],
            { ordered: false }
        );
    });

    test("skips bulkWrite for empty arrays", async () => {
        const bulkWrite = jest.fn();

        const result = await mongoSaveArray({ bulkWrite }, [], "name");

        expect(result).toBeNull();
        expect(bulkWrite).not.toHaveBeenCalled();
    });

    test("throws when a document is missing its id field", async () => {
        await expect(mongoSaveArray({ bulkWrite: jest.fn() }, [{ value: 1 }], "name")).rejects.toThrow(
            "missing id field 'name'"
        );
    });
});
