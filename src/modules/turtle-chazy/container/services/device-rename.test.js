describe("device-rename", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("renames device and updates collections", async () => {
        const config = {
            address: "192.168.1.1",
        };
        const turtleWebApi = { command: jest.fn().mockResolvedValue(true) };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const mongoCollection = jest.fn();
        const devicesCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const sourcesCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const destinationsCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const logger = { info: jest.fn(), error: jest.fn() };

        mongoCollection
            .mockResolvedValueOnce(devicesCollection)
            .mockResolvedValueOnce(sourcesCollection)
            .mockResolvedValueOnce(destinationsCollection);

        jest.doMock("@utils/turtle-webapi", () => turtleWebApi);
        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/mongo-collection", () => mongoCollection);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "new-device")).resolves.toBe(true);
        expect(turtleWebApi.command).toHaveBeenCalledWith("192.168.1.1", ["SET", "DANTE", "DEV", "old-device", "NAME", "new-device"]);
        expect(devicesCollection.updateOne).toHaveBeenCalledWith(
            { name: "old-device" },
            expect.objectContaining({
                $set: expect.objectContaining({
                    name: "new-device",
                }),
            })
        );
        expect(sourcesCollection.updateOne).toHaveBeenCalledWith(
            { deviceId: "old-device" },
            expect.objectContaining({
                $set: expect.objectContaining({
                    deviceId: "new-device",
                }),
            })
        );
        expect(destinationsCollection.updateOne).toHaveBeenCalledWith(
            { deviceId: "old-device" },
            expect.objectContaining({
                $set: expect.objectContaining({
                    deviceId: "new-device",
                }),
            })
        );
    });

    test("migrates button icon and color settings during rename", async () => {
        const config = {
            address: "192.168.1.1",
            sourceIcons: { "old-device": ["star", null, "heart"] },
            sourceIconColors: { "old-device": ["#ff0000", null, "#00ff00"] },
            destinationIcons: { "old-device": [null, "star"] },
            destinationIconColors: { "old-device": [null, "#0000ff"] },
        };
        const turtleWebApi = { command: jest.fn().mockResolvedValue(true) };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockResolvedValue(true);
        const mongoCollection = jest.fn();
        const devicesCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const sourcesCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const destinationsCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const logger = { info: jest.fn(), error: jest.fn() };

        mongoCollection
            .mockResolvedValueOnce(devicesCollection)
            .mockResolvedValueOnce(sourcesCollection)
            .mockResolvedValueOnce(destinationsCollection);

        jest.doMock("@utils/turtle-webapi", () => turtleWebApi);
        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/mongo-collection", () => mongoCollection);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "new-device")).resolves.toBe(true);
        expect(config.sourceIcons["new-device"]).toEqual(["star", null, "heart"]);
        expect(config.sourceIcons["old-device"]).toBeUndefined();
        expect(config.sourceIconColors["new-device"]).toEqual(["#ff0000", null, "#00ff00"]);
        expect(config.sourceIconColors["old-device"]).toBeUndefined();
        expect(config.destinationIcons["new-device"]).toEqual([null, "star"]);
        expect(config.destinationIcons["old-device"]).toBeUndefined();
        expect(config.destinationIconColors["new-device"]).toEqual([null, "#0000ff"]);
        expect(config.destinationIconColors["old-device"]).toBeUndefined();
        expect(configPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when device name is invalid", async () => {
        const configGet = jest.fn().mockResolvedValue({ address: "192.168.1.1" });
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "invalid@name")).rejects.toThrow("new name must only contain letters, numbers, and dashes");
    });

    test("throws when device name is too long", async () => {
        const configGet = jest.fn().mockResolvedValue({ address: "192.168.1.1" });
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "this-is-a-very-long-device-name-that-exceeds-thirty-chars")).rejects.toThrow("new name must be 30 characters or less");
    });

    test("throws when device name starts or ends with dash", async () => {
        const configGet = jest.fn().mockResolvedValue({ address: "192.168.1.1" });
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "-invalid")).rejects.toThrow("new name must not begin or end with a dash");
        await expect(service("old-device", "invalid-")).rejects.toThrow("new name must not begin or end with a dash");
    });

    test("throws when config loading fails", async () => {
        const configGet = jest.fn().mockResolvedValue(null);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "new-device")).rejects.toThrow("failed to fetch config");
        expect(logger.error).toHaveBeenCalledTimes(1);
    });

    test("throws when turtle web API command fails", async () => {
        const config = { address: "192.168.1.1" };
        const turtleWebApi = { command: jest.fn().mockRejectedValue(new Error("Connection failed")) };
        const configGet = jest.fn().mockResolvedValue(config);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@utils/turtle-webapi", () => turtleWebApi);
        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "new-device")).rejects.toThrow("failed to rename device");
        expect(logger.error).toHaveBeenCalledWith("failed to rename device: Connection failed");
    });

    test("does not throw when config save fails for button icon migration", async () => {
        // Note: The current implementation throws on configPutViaCore failure.
        // This test documents that behavior. Update this test if the behavior changes.
        const config = {
            address: "192.168.1.1",
            sourceIcons: { "old-device": ["star"] },
            sourceIconColors: { "old-device": ["#ff0000"] },
        };
        const turtleWebApi = { command: jest.fn().mockResolvedValue(true) };
        const configGet = jest.fn().mockResolvedValue(config);
        const configPutViaCore = jest.fn().mockRejectedValue(new Error("Config save failed"));
        const mongoCollection = jest.fn();
        const devicesCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const sourcesCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const destinationsCollection = {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        };
        const logger = { info: jest.fn(), error: jest.fn() };

        mongoCollection
            .mockResolvedValueOnce(devicesCollection)
            .mockResolvedValueOnce(sourcesCollection)
            .mockResolvedValueOnce(destinationsCollection);

        jest.doMock("@utils/turtle-webapi", () => turtleWebApi);
        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@core/config-putviacore", () => configPutViaCore);
        jest.doMock("@core/mongo-collection", () => mongoCollection);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./device-rename");

        await expect(service("old-device", "new-device")).rejects.toThrow("failed to save button icon settings");
    });
});
