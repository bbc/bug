jest.mock("@utils/restore-config", () => jest.fn());
jest.mock("@core/logger", () => {
    const logger = { info: jest.fn(), error: jest.fn() };
    return () => logger;
});

const path = require("path");
const restoreConfig = require("@utils/restore-config");
const logger = require("@core/logger")(module);
const systemRestore = require("./system-restore");

describe("system-restore", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        restoreConfig.mockResolvedValue(undefined);
    });

    test("restores an uploaded archive regardless of its reported MIME type", async () => {
        const backup = {
            name: "backup.tgz",
            size: 100,
            mimetype: "application/octet-stream",
            tempFilePath: "data/upload",
        };
        const root = path.resolve(__dirname, "../../..");

        await expect(systemRestore(backup)).resolves.toEqual({
            status: "success",
            message: "Restored settings from file",
            data: "Restored settings from file",
        });
        expect(restoreConfig).toHaveBeenCalledWith(
            path.join(root, "data/upload"),
            path.join(root, "config"),
            path.join(root, "data")
        );
    });

    test("rejects an upload without a temporary file", async () => {
        await expect(systemRestore({})).rejects.toThrow("Failed to complete system restore");
        expect(restoreConfig).not.toHaveBeenCalled();
    });

    test("logs and reports a restore failure", async () => {
        restoreConfig.mockRejectedValue(new Error("invalid archive"));

        await expect(systemRestore({ tempFilePath: "data/upload" })).rejects.toThrow(
            "Failed to complete system restore"
        );
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("invalid archive"));
    });

    test("preserves the recovery location when rollback fails", async () => {
        const error = new Error("Restore failed and rollback was incomplete. Recovery files: /tmp/recovery");
        error.code = "RESTORE_ROLLBACK_INCOMPLETE";
        restoreConfig.mockRejectedValue(error);

        await expect(systemRestore({ tempFilePath: "data/upload" })).rejects.toThrow(error.message);
    });
});
