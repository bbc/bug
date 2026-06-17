describe("group-delete", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("deletes matching group and persists config", async () => {
        const config = {
            sourceGroups: [
                { name: "Keep", value: [] },
                { name: "Drop", value: [1] },
            ],
        };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), warning: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-delete");

        await expect(service("source", "Drop")).resolves.toBe(true);
        expect(config.sourceGroups).toEqual([{ name: "Keep", value: [] }]);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("logs warning when group is not found", async () => {
        const config = { sourceGroups: [{ name: "Keep", value: [] }] };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), warning: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-delete");

        await expect(service("source", "Missing")).resolves.toBe(true);
        expect(logger.warning).toHaveBeenCalledTimes(1);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });
});
