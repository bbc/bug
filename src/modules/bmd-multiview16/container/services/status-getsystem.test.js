const mockMongoGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/StatusItem", () => function StatusItem(payload) { return { ...payload }; });
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./status-getsystem");

describe("status-getsystem", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("returns a description status item when a friendly name is present", async () => {
        mockMongoGet.mockResolvedValue({ friendly_name: "Studio Router" });
        const result = await service();
        expect(result).toMatchObject({
            key: "description",
            message: "Device Studio Router active and running",
            type: "default",
        });
    });

    test("returns a generic status item when there is no friendly name", async () => {
        mockMongoGet.mockResolvedValue({});
        const result = await service();
        expect(result).toMatchObject({
            key: "nodescription",
            message: "Device active and running",
            type: "default",
        });
    });

    test("returns an empty array on error", async () => {
        mockMongoGet.mockResolvedValue(undefined);
        await expect(service()).resolves.toEqual([]);
    });
});
