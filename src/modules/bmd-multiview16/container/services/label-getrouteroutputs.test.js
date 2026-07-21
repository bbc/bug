const mockMongoGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./label-getrouteroutputs");

describe("label-getrouteroutputs", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("maps label objects into an array keyed by output index", async () => {
        mockMongoGet.mockResolvedValue([
            { outputIndex: 0, outputLabel: "Out A" },
            { outputIndex: 2, outputLabel: "Out C" },
        ]);
        const result = await service();
        expect(result[0]).toBe("Out A");
        expect(result[2]).toBe("Out C");
    });

    test("returns an empty array when there are no labels", async () => {
        mockMongoGet.mockResolvedValue(undefined);
        await expect(service()).resolves.toEqual([]);
    });

    test("handles dependency exceptions", async () => {
        mockMongoGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
