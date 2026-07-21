const mockCheckCollection = jest.fn();
const mockCheckConfig = jest.fn();
const mockGetSystem = jest.fn();

jest.mock("@core/status-checkcollection", () => (...args) => mockCheckCollection(...args));
jest.mock("@core/status-checkconfig", () => (...args) => mockCheckConfig(...args));
jest.mock("./status-getsystem", () => (...args) => mockGetSystem(...args));

const service = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        mockCheckCollection.mockReset();
        mockCheckConfig.mockReset();
        mockGetSystem.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("concatenates the results of all status checks", async () => {
        mockCheckCollection.mockResolvedValue([{ key: "collection" }]);
        mockCheckConfig.mockResolvedValue([{ key: "config" }]);
        mockGetSystem.mockResolvedValue({ key: "system" });

        const result = await service();

        expect(result).toEqual([{ key: "collection" }, { key: "config" }, { key: "system" }]);
    });

    test("passes the device collection check parameters", async () => {
        mockCheckCollection.mockResolvedValue([]);
        mockCheckConfig.mockResolvedValue([]);
        mockGetSystem.mockResolvedValue([]);

        await service();

        expect(mockCheckCollection).toHaveBeenCalledWith(
            expect.objectContaining({
                collectionName: "videohub_device",
                itemType: "critical",
                timeoutSeconds: 60,
                flags: ["restartPanel", "configurePanel"],
            })
        );
    });
});
