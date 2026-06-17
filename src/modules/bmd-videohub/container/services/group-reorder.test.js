describe("group-reorder", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("reorders groups by provided names and saves config", async () => {
        const config = {
            sourceGroups: [
                { name: "A", value: [1] },
                { name: "B", value: [2] },
            ],
        };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), warning: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-reorder");

        await expect(service("source", ["B", "A"])).resolves.toBe(true);
        expect(config.sourceGroups.map((g) => g.name)).toEqual(["B", "A"]);
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when groupNames is empty", async () => {
        const configGet = jest.fn().mockResolvedValue({ sourceGroups: [{ name: "A", value: [] }] });
        const configPutViaCore = jest.fn();
        const logger = { info: jest.fn(), warning: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./group-reorder");

        await expect(service("source", [])).rejects.toThrow("groupNames must be a non-empty array");
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
