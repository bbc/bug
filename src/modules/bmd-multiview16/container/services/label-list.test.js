const mockMongoGet = jest.fn();
const mockConfigGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./label-list");

describe("label-list", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
        mockConfigGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(undefined);
        await expect(service()).rejects.toThrow("failed to load config");
    });

    test("builds a label array combining config and database values", async () => {
        mockConfigGet.mockResolvedValue({
            autoLabelIndex: { 0: 2 },
            autoLabelEnabled: [0],
        });
        mockMongoGet.mockImplementation(async (collection) => {
            if (collection === "routerlabels") {
                return { 2: { inputLabel: "Router In C" } };
            }
            if (collection === "input_labels") {
                return { 0: "News UK", 1: "News Int'l" };
            }
            return undefined;
        });

        const result = await service();

        expect(result).toEqual([
            {
                inputIndex: 0,
                input: "1",
                label: "News UK",
                autoLabel: "Router In C",
                autoLabelIndex: 2,
                autoLabelEnabled: true,
            },
            {
                inputIndex: 1,
                input: "2",
                label: "News Int'l",
                autoLabel: "",
                autoLabelIndex: "",
                autoLabelEnabled: false,
            },
        ]);
    });

    test("returns an empty array when there are no input labels", async () => {
        mockConfigGet.mockResolvedValue({});
        mockMongoGet.mockResolvedValue(undefined);
        await expect(service()).resolves.toEqual([]);
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});
