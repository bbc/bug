describe("group-rename", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("renames existing group and saves config", async () => {
        const config = { outputGroups: [{ name: "Old", value: [1] }] };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-rename");

        await expect(service("output", "Old", "New")).resolves.toBe(true);
        expect(config.outputGroups[0].name).toBe("New");
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when new name already exists", async () => {
        const configGet = jest.fn().mockResolvedValue({
            outputGroups: [
                { name: "Old", value: [] },
                { name: "New", value: [] },
            ],
        });
        const configPutViaCore = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-rename");

        await expect(service("output", "Old", "New")).rejects.toThrow('group "New" already exists in outputGroups');
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
