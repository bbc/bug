jest.mock("@utils/untar-folder", () => jest.fn());
jest.mock("fs-extra", () => ({ move: jest.fn() }));
jest.mock("delay", () => ({ default: jest.fn() }));
jest.mock("@core/logger", () => {
    const logger = { info: jest.fn(), error: jest.fn() };
    return () => logger;
});

const path = require("path");
const untarFolder = require("@utils/untar-folder");
const fs = require("fs-extra");
const delay = require("delay").default;
const logger = require("@core/logger")(module);
const systemRestore = require("./system-restore");

describe("system-restore", () => {
    const backup = { name: "backup.tgz", size: 100, mimetype: "application/gzip", tempFilePath: "data/upload.tgz" };

    beforeEach(() => {
        jest.resetAllMocks();
        untarFolder.mockResolvedValue(undefined);
        delay.mockResolvedValue(undefined);
        fs.move.mockResolvedValue(undefined);
    });

    test("extracts a gzip backup and restores panel and global configuration", async () => {
        await expect(systemRestore(backup)).resolves.toEqual({
            status: "success",
            message: "Restored settings from file",
            data: "Restored settings from file",
        });

        const root = path.resolve(__dirname, "../../..");
        expect(untarFolder).toHaveBeenCalledWith(path.join(root, "data/upload.tgz"), path.join(root, "data"));
        expect(fs.move).toHaveBeenNthCalledWith(1, path.join(root, "data/panels"), path.join(root, "config/panels"), {
            overwrite: true,
        });
        expect(fs.move).toHaveBeenNthCalledWith(2, path.join(root, "data/global"), path.join(root, "config/global"), {
            overwrite: true,
        });
        expect(untarFolder.mock.invocationCallOrder[0]).toBeLessThan(fs.move.mock.invocationCallOrder[0]);
    });

    test("reports an extraction failure without moving configuration", async () => {
        untarFolder.mockRejectedValue(new Error("invalid archive"));

        await expect(systemRestore(backup)).rejects.toThrow("Failed to complete system restore");
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("invalid archive"));
        expect(fs.move).not.toHaveBeenCalled();
    });

    test.each([1, 2])("reports a failure moving configuration folder %i", async (failureCall) => {
        if (failureCall === 2) {
            fs.move.mockResolvedValueOnce(undefined);
        }
        fs.move.mockRejectedValueOnce(new Error("move failed"));

        await expect(systemRestore(backup)).rejects.toThrow("Failed to complete system restore");
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("move failed"));
        expect(fs.move).toHaveBeenCalledTimes(failureCall);
    });

    test("rejects an upload without a temporary file path", async () => {
        await expect(systemRestore({ mimetype: "application/gzip" })).rejects.toThrow(
            "Failed to complete system restore"
        );
        expect(untarFolder).not.toHaveBeenCalled();
        expect(fs.move).not.toHaveBeenCalled();
    });
});
