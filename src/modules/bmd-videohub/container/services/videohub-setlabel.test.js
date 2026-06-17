describe("videohub-setlabel", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("sets label and disconnects router", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: { 4: "Cam 4" } }),
            disconnect: jest.fn().mockResolvedValue(),
        };
        const configGet = jest.fn().mockResolvedValue({ address: "127.0.0.1", port: 9990 });
        const videohub = jest.fn(() => router);
        const cacheResponse = jest.fn().mockResolvedValue();
        const delay = jest.fn().mockResolvedValue();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@utils/videohub-cache-response", () => cacheResponse);
        jest.doMock("delay", () => delay);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./videohub-setlabel");

        await expect(service(4, "output", "Cam 4")).resolves.toBe(true);
        expect(router.send).toHaveBeenCalledWith("OUTPUT LABELS", "4 Cam 4");
        expect(delay).toHaveBeenCalledWith(200);
        expect(cacheResponse).toHaveBeenCalledWith({ data: { 4: "Cam 4" } });
        expect(router.disconnect).toHaveBeenCalledTimes(1);
    });

    test("throws on invalid type", async () => {
        const configGet = jest.fn();
        const videohub = jest.fn();
        const cacheResponse = jest.fn();
        const delay = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@utils/videohub-cache-response", () => cacheResponse);
        jest.doMock("delay", () => delay);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./videohub-setlabel");

        await expect(service(1, "bad", "x")).rejects.toThrow("invalid type 'bad'");
        expect(videohub).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
