jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const trafficSaveHistory = require("./traffic-savehistory");

describe("traffic-savehistory", () => {
    test("saves history document", async () => {
        const mockCollection = { insertOne: jest.fn(async () => undefined) };
        const interfaces = [{ id: 1, "tx-rate": 10, "rx-rate": 20 }];

        await expect(trafficSaveHistory(mockCollection, interfaces)).resolves.toBeUndefined();
        expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    });

    test("rejects when insert fails", async () => {
        const mockCollection = {
            insertOne: jest.fn(async () => {
                throw new Error("insert failed");
            }),
        };

        await expect(trafficSaveHistory(mockCollection, [])).rejects.toThrow("insert failed");
    });
});
