const request = require("supertest");
const { Readable } = require("stream");

jest.mock("@middleware/restrict", () => ({
    to: () => (_req, _res, next) => next(),
}));
jest.mock("@services/system-backup", () => jest.fn());
jest.mock("@services/system-restore", () => jest.fn());

const systemBackup = require("@services/system-backup");
const systemRestore = require("@services/system-restore");
const system = require("@bin/api");

describe("system backup and restore routes", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("streams the backup as a named attachment", async () => {
        systemBackup.mockResolvedValue({ filename: "backup.tgz", stream: Readable.from(["backup contents"]) });

        const response = await request(system).get("/api/system/backup");

        expect(response.statusCode).toBe(200);
        expect(response.headers["content-disposition"]).toBe('attachment; filename="backup.tgz"');
        expect(response.text).toBe("backup contents");
    });

    test("rejects a restore request without an uploaded backup", async () => {
        const response = await request(system).post("/api/system/restore").send({});

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ status: "failure", message: "No files uploaded" }));
        expect(systemRestore).not.toHaveBeenCalled();
    });

    test("passes backup service errors to the error handler", async () => {
        systemBackup.mockRejectedValue(new Error("backup failed"));

        const response = await request(system).get("/api/system/backup");

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ status: "error", message: "backup failed" });
    });
});
