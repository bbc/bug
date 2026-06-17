describe("group-set", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("sets group buttons and persists config", async () => {
        const config = { destinationGroups: [{ name: "One", value: [1] }] };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-set");

        await expect(service("destination", 0, [2, 3])).resolves.toBe(true);
        expect(config.destinationGroups[0].value).toEqual([2, 3]);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when group does not exist", async () => {
        const configGet = jest.fn().mockResolvedValue({ destinationGroups: [] });
        const configPutViaCore = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-set");

        await expect(service("destination", 0, [2, 3])).rejects.toThrow("group at index 0 not found in destinationGroups");
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
