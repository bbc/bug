describe("videohub-lock", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("locks output and disconnects router", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: { 1: "O" } }),
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

        const service = require("./videohub-lock");

        await expect(service(1)).resolves.toBe(true);
        expect(configGet).toHaveBeenCalledTimes(1);
        expect(videohub).toHaveBeenCalledWith({ port: 9990, host: "127.0.0.1" });
        expect(router.connect).toHaveBeenCalledTimes(1);
        expect(router.send).toHaveBeenCalledWith("VIDEO OUTPUT LOCKS", "1 O");
        expect(router.query).toHaveBeenCalledWith("VIDEO OUTPUT LOCKS");
        expect(cacheResponse).toHaveBeenCalledWith({ data: { 1: "O" } });
        expect(router.disconnect).toHaveBeenCalledTimes(1);
    });

    test("throws when lock verification fails and still disconnects", async () => {
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

        const service = require("./videohub-lock");

        await expect(service(1)).rejects.toThrow("Failed to verify lock setting");
        expect(cacheResponse).not.toHaveBeenCalled();
        expect(router.disconnect).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
