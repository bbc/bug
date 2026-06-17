describe("button-remove", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("removes an existing button index and persists config", async () => {
        const config = {
            outputGroups: [{ name: "Main", value: [1, 2, 3] }],
        };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./button-remove");

        await expect(service("output", 0, 2)).resolves.toBe(true);
        expect(config.outputGroups[0].value).toEqual([1, 3]);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when group index does not exist", async () => {
        const configGet = jest.fn().mockResolvedValue({ outputGroups: [] });
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./button-remove");

        await expect(service("output", 1, 2)).rejects.toThrow("group at index 1 does not exist");
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
