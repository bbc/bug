describe("button-seticon", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("sets icon and color then saves config with device-keyed structure", async () => {
        const config = {};
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./button-seticon");

        await expect(service("source", "device1", 2, "star", "red")).resolves.toBe(true);
        expect(config.sourceIcons).toEqual({ device1: [null, null, "star"] });
        expect(config.sourceIconColors).toEqual({ device1: [null, null, "red"] });
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("sets icon and color for multiple devices independently", async () => {
        const config = {};
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./button-seticon");

        await expect(service("source", "device1", 0, "star", "red")).resolves.toBe(true);
        await expect(service("source", "device2", 1, "heart", "blue")).resolves.toBe(true);

        expect(config.sourceIcons).toEqual({ device1: ["star"], device2: [null, "heart"] });
        expect(config.sourceIconColors).toEqual({ device1: ["red"], device2: [null, "blue"] });
    });

    test("throws when config loading fails", async () => {
        const configGet = jest.fn().mockResolvedValue(null);
        const configPutViaCore = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./button-seticon");

        await expect(service("source", "device1", 0, "star", "red")).rejects.toThrow("failed to load config");
        expect(configPutViaCore).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
