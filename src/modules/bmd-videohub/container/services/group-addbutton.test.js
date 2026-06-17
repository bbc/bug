describe("group-addbutton", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("adds button to listed groups and saves config", async () => {
        const config = {
            sourceGroups: [
                { name: "A", value: [1] },
                { name: "B", value: [] },
            ],
        };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-addbutton");

        await expect(service("source", "0,1", "3")).resolves.toBe(true);
        expect(config.sourceGroups[0].value).toEqual([1, 3]);
        expect(config.sourceGroups[1].value).toEqual([3]);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when config loading fails", async () => {
        const configGet = jest.fn().mockResolvedValue(null);
        const configPutViaCore = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-addbutton");

        await expect(service("source", "0", "3")).rejects.toThrow("failed to load config");
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
