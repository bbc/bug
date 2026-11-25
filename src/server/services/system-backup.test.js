jest.mock("@utils/tar-folder", () => jest.fn());
jest.mock("@services/system-settings-get", () => jest.fn());
jest.mock("@core/logger", () => {
    const logger = { info: jest.fn(), error: jest.fn() };
    return () => logger;
});

const path = require("path");
const { Readable } = require("stream");
const tarFolder = require("@utils/tar-folder");
const getSystemSettings = require("@services/system-settings-get");
const logger = require("@core/logger")(module);
const systemBackup = require("./system-backup");

describe("system-backup", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("archives panel and global configuration and returns a sanitized filename", async () => {
        const stream = Readable.from(["backup"]);
        getSystemSettings.mockResolvedValue({ data: { title: "Studio/A" } });
        tarFolder.mockResolvedValue(stream);

        const backup = await systemBackup();

        expect(tarFolder).toHaveBeenCalledWith(path.resolve(__dirname, "../../../config"), ["panels", "global"]);
        expect(backup.stream).toBe(stream);
        expect(backup.filename).toMatch(/^studio_a-backup-\d{2}-\d{2}-\d{4}-\d{2}-\d{2}-\d{2}\.tgz$/);
    });

    test("uses an empty title when no title is configured", async () => {
        getSystemSettings.mockResolvedValue({ data: {} });
        tarFolder.mockResolvedValue(Readable.from([]));

        const backup = await systemBackup();

        expect(backup.filename).toMatch(/^-backup-\d{2}-\d{2}-\d{4}-\d{2}-\d{2}-\d{2}\.tgz$/);
    });

    test("reports a settings lookup failure without creating an archive", async () => {
        getSystemSettings.mockRejectedValue(new Error("settings unavailable"));

        await expect(systemBackup()).rejects.toThrow("Failed to complete system backup");
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("settings unavailable"));
        expect(tarFolder).not.toHaveBeenCalled();
    });

    test("reports an archive creation failure", async () => {
        getSystemSettings.mockResolvedValue({ data: {} });
        tarFolder.mockRejectedValue(new Error("archive failed"));

        await expect(systemBackup()).rejects.toThrow("Failed to complete system backup");
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("archive failed"));
    });
});
