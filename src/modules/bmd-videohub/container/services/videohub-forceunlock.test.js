describe("videohub-forceunlock", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("force unlocks output and disconnects router", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: { 1: "F" } }),
            disconnect: jest.fn().mockResolvedValue(),
        };

        const configGet = jest.fn().mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        const videohub = jest.fn(() => router);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./videohub-forceunlock");

        await expect(service(1)).resolves.toBe(true);
        expect(configGet).toHaveBeenCalledTimes(1);
        expect(videohub).toHaveBeenCalledWith({ port: 9990, host: "127.0.0.1" });
        expect(router.connect).toHaveBeenCalledTimes(1);
        expect(router.send).toHaveBeenCalledWith("VIDEO OUTPUT LOCKS", "1 F");
        expect(router.query).toHaveBeenCalledWith("VIDEO OUTPUT LOCKS");
        expect(router.disconnect).toHaveBeenCalledTimes(1);
    });

    test("throws when force unlock verification fails and still disconnects", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: {} }),
            disconnect: jest.fn().mockResolvedValue(),
        };

        const configGet = jest.fn().mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        const videohub = jest.fn(() => router);
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./videohub-forceunlock");

        await expect(service(1)).rejects.toThrow("Failed to verify force unlock setting");
        expect(router.disconnect).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
