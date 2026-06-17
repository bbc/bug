describe("videohub-route", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("routes destination to source and disconnects router", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: { 1: "2" } }),
            disconnect: jest.fn().mockResolvedValue(),
        };
        const configGet = jest.fn().mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        const videohub = jest.fn(() => router);
        const cacheResponse = jest.fn().mockResolvedValue();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@utils/videohub-cache-response", () => cacheResponse);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./videohub-route");

        await expect(service(1, 2)).resolves.toBe(true);
        expect(router.send).toHaveBeenCalledWith("VIDEO OUTPUT ROUTING", ["1 2"]);
        expect(cacheResponse).toHaveBeenCalledWith({ data: { 1: "2" } });
        expect(router.disconnect).toHaveBeenCalledTimes(1);
    });

    test("throws on invalid source index", async () => {
        const configGet = jest.fn().mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        const videohub = jest.fn();
        const cacheResponse = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@utils/videohub-cache-response", () => cacheResponse);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./videohub-route");

        await expect(service(1, null)).rejects.toThrow("invalid sourceIndex provided");
        expect(videohub).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
