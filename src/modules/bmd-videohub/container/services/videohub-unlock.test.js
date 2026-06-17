describe("videohub-unlock", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("unlocks output and disconnects router", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: { 1: "U" } }),
            disconnect: jest.fn().mockResolvedValue(),
        };

        const configGet = jest.fn().mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        const videohub = jest.fn(() => router);
        const logger = { info: jest.fn(), error: jest.fn() };
        const cacheResponse = jest.fn().mockResolvedValue();

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@core/logger", () => () => logger);
        jest.doMock("@utils/videohub-cache-response", () => cacheResponse);

        const service = require("./videohub-unlock");

        await expect(service(1)).resolves.toBe(true);
        expect(configGet).toHaveBeenCalledTimes(1);
        expect(videohub).toHaveBeenCalledWith({ port: 9990, host: "127.0.0.1" });
        expect(router.connect).toHaveBeenCalledTimes(1);
        expect(router.send).toHaveBeenCalledWith("VIDEO OUTPUT LOCKS", "1 U");
        expect(router.query).toHaveBeenCalledWith("VIDEO OUTPUT LOCKS");
        expect(cacheResponse).toHaveBeenCalledWith({ data: { 1: "U" } });
        expect(router.disconnect).toHaveBeenCalledTimes(1);
    });

    test("throws when unlock verification fails and still disconnects", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: {} }),
            disconnect: jest.fn().mockResolvedValue(),
        };

        const configGet = jest.fn().mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        const videohub = jest.fn(() => router);
        const logger = { info: jest.fn(), error: jest.fn() };
        const cacheResponse = jest.fn().mockResolvedValue();

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@core/logger", () => () => logger);
        jest.doMock("@utils/videohub-cache-response", () => cacheResponse);

        const service = require("./videohub-unlock");

        await expect(service(1)).rejects.toThrow("Failed to verify unlock setting");
        expect(cacheResponse).not.toHaveBeenCalled();
        expect(router.disconnect).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
