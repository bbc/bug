describe("videohub-setlabels", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("sets multiple labels, verifies and disconnects", async () => {
        const router = {
            connect: jest.fn().mockResolvedValue(),
            send: jest.fn().mockResolvedValue(),
            query: jest.fn().mockResolvedValue({ data: { 0: "In 1" } }),
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

        const service = require("./videohub-setlabels");

        await expect(
            service({
                labels: [
                    { type: "input", index: 0, label: "In 1" },
                    { type: "output", index: 1, label: "Out 2" },
                ],
            })
        ).resolves.toBe(true);
        expect(router.send).toHaveBeenNthCalledWith(1, "INPUT LABELS", "0 In 1");
        expect(router.send).toHaveBeenNthCalledWith(2, "OUTPUT LABELS", "1 Out 2");
        expect(router.query).toHaveBeenCalledWith("OUTPUT LABELS");
        expect(cacheResponse).toHaveBeenCalledWith({ data: { 0: "In 1" } });
        expect(router.disconnect).toHaveBeenCalledTimes(1);
    });

    test("throws on invalid labels payload", async () => {
        const configGet = jest.fn();
        const videohub = jest.fn();
        const cacheResponse = jest.fn();
        const logger = { info: jest.fn(), error: jest.fn() };

        jest.doMock("@core/config-get", () => configGet);
        jest.doMock("@utils/videohub-promise", () => videohub);
        jest.doMock("@utils/videohub-cache-response", () => cacheResponse);
        jest.doMock("@core/logger", () => () => logger);

        const service = require("./videohub-setlabels");

        await expect(service({})).rejects.toThrow("invalid array passed to method");
        expect(videohub).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
