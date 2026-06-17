describe("button-setquad", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("sets quad value and persists config", async () => {
        const config = {};
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./button-setquad");

        await expect(service("destination", 1, true)).resolves.toBe(true);
        expect(config.destinationQuads).toEqual([null, true]);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when config loading fails", async () => {
        const configGet = jest.fn().mockResolvedValue(null);
        const configPutViaCore = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./button-setquad");

        await expect(service("destination", 1, true)).rejects.toThrow("failed to load config");
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
