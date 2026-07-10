const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const service = require("./sources-list");

describe("sources-list", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
    });

    test("defaults source device and marks selected source by matching route", async () => {
        const devices = [{ name: "src-a" }, { name: "src-b" }];
        const sourceDoc = {
            deviceId: "src-a",
            labels: [
                { index: 1, name: "Input 1" },
                { index: 2, name: "Input 2" },
            ],
        };
        const routesDoc = {
            deviceId: "dest-a",
            routes: [
                { destinationIndex: 5, sourceDevice: "src-a", sourceChannel: "Input 2", sourceIndex: 2 },
            ],
        };

        const devicesCollection = {
            find: jest.fn(() => ({
                collation: jest.fn(() => ({
                    sort: jest.fn(() => ({
                        toArray: jest.fn(async () => devices),
                    })),
                })),
            })),
        };
        const sourcesCollection = {
            findOne: jest.fn(async () => sourceDoc),
        };
        const routesCollection = {
            findOne: jest.fn(async () => routesDoc),
        };

        mockMongoCollection.mockImplementation(async (name) => {
            if (name === "devices") return devicesCollection;
            if (name === "sources") return sourcesCollection;
            if (name === "routes") return routesCollection;
            throw new Error(`unexpected collection ${name}`);
        });

        const result = await service("-", "dest-a", 5);

        expect(result.devices[0]).toMatchObject({ label: "src-a", selected: true });
        expect(result.sources[0]).toMatchObject({ index: 1, selected: false });
        expect(result.sources[1]).toMatchObject({ index: 2, selected: true });
    });
});
