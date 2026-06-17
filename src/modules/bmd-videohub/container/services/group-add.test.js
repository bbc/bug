describe("group-add", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("adds a new group and persists config", async () => {
        const config = { destinationGroups: [{ name: "A", value: [] }] };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-add");

        await expect(service("destination", "B")).resolves.toBe(true);
        expect(config.destinationGroups).toEqual([{ name: "A", value: [] }, { name: "B", value: [] }]);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when group already exists", async () => {
        const configGet = jest.fn().mockResolvedValue({ sourceGroups: [{ name: "News", value: [] }] });
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-add");

        await expect(service("source", "news")).rejects.toThrow("Group news already exists");
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
