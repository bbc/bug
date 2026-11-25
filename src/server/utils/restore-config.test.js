jest.mock("@core/logger", () => {
    const logger = { error: jest.fn(), warning: jest.fn() };
    return () => logger;
});

const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const { pipeline } = require("stream/promises");
const tarFolder = require("./tar-folder");
const restoreConfig = require("./restore-config");
const logger = require("@core/logger")(module);

describe("restore-config", () => {
    let root;
    let config;
    let data;
    let backupSource;
    let archive;

    const createArchive = async () => {
        const stream = await tarFolder(backupSource, ["panels", "global"]);
        await pipeline(stream, fs.createWriteStream(archive));
    };

    beforeEach(async () => {
        root = await fs.mkdtemp(path.join(os.tmpdir(), "bug-restore-test-"));
        config = path.join(root, "config");
        data = path.join(root, "data");
        backupSource = path.join(root, "backup-source");
        archive = path.join(root, "backup.tgz");
        for (const folder of ["panels", "global"]) {
            await fs.ensureDir(path.join(config, folder));
            await fs.ensureDir(path.join(backupSource, folder));
        }
        await fs.writeJson(path.join(config, "panels", "old.json"), { id: "old" });
        await fs.writeJson(path.join(config, "global", "settings.json"), { title: "old" });
        await fs.writeJson(path.join(backupSource, "panels", "new.json"), { id: "new" });
        await fs.writeJson(path.join(backupSource, "global", "settings.json"), { title: "new" });
    });

    afterEach(async () => {
        jest.restoreAllMocks();
        await fs.remove(root);
    });

    test("restores a real backup, replacing contents without replacing directory roots", async () => {
        await createArchive();
        const panelsBefore = await fs.stat(path.join(config, "panels"));
        const globalBefore = await fs.stat(path.join(config, "global"));

        await restoreConfig(archive, config, data);

        expect(await fs.readdir(path.join(config, "panels"))).toEqual(["new.json"]);
        expect(await fs.readJson(path.join(config, "panels", "new.json"))).toEqual({ id: "new" });
        expect(await fs.readJson(path.join(config, "global", "settings.json"))).toEqual({ title: "new" });
        expect((await fs.stat(path.join(config, "panels"))).ino).toBe(panelsBefore.ino);
        expect((await fs.stat(path.join(config, "global"))).ino).toBe(globalBefore.ino);
        expect(await fs.readdir(data)).toEqual([]);
    });

    test("rejects a corrupt archive without touching existing configuration", async () => {
        await fs.writeFile(archive, "not a gzip archive");

        await expect(restoreConfig(archive, config, data)).rejects.toThrow();

        expect(await fs.readJson(path.join(config, "panels", "old.json"))).toEqual({ id: "old" });
        expect(await fs.readJson(path.join(config, "global", "settings.json"))).toEqual({ title: "old" });
        expect(await fs.readdir(data)).toEqual([]);
    });

    test("rejects a truncated gzip archive without touching existing configuration", async () => {
        await createArchive();
        const content = await fs.readFile(archive);
        await fs.writeFile(archive, content.subarray(0, Math.floor(content.length / 2)));

        await expect(restoreConfig(archive, config, data)).rejects.toThrow();

        expect(await fs.readJson(path.join(config, "panels", "old.json"))).toEqual({ id: "old" });
        expect(await fs.readJson(path.join(config, "global", "settings.json"))).toEqual({ title: "old" });
    });

    test("rejects missing configuration directories without touching existing configuration", async () => {
        const tar = require("tar");
        await tar.c({ gzip: true, cwd: backupSource, file: archive }, ["panels"]);

        await expect(restoreConfig(archive, config, data)).rejects.toThrow();

        expect(await fs.readJson(path.join(config, "panels", "old.json"))).toEqual({ id: "old" });
        expect(await fs.readJson(path.join(config, "global", "settings.json"))).toEqual({ title: "old" });
    });

    test("rejects invalid JSON without touching existing configuration", async () => {
        await fs.writeFile(path.join(backupSource, "global", "settings.json"), "{invalid");
        await createArchive();

        await expect(restoreConfig(archive, config, data)).rejects.toThrow("Invalid configuration file");

        expect(await fs.readJson(path.join(config, "panels", "old.json"))).toEqual({ id: "old" });
        expect(await fs.readJson(path.join(config, "global", "settings.json"))).toEqual({ title: "old" });
    });

    test("rejects symbolic links in a backup", async () => {
        await fs.symlink("new.json", path.join(backupSource, "panels", "linked.json"));
        await createArchive();

        await expect(restoreConfig(archive, config, data)).rejects.toThrow("Invalid backup entry");

        expect(await fs.readJson(path.join(config, "panels", "old.json"))).toEqual({ id: "old" });
    });

    test("rejects paths outside the backup directories", async () => {
        const tar = require("tar");
        await fs.writeJson(path.join(root, "outside.json"), { id: "outside" });
        await tar.c({ gzip: true, cwd: backupSource, file: archive, preservePaths: true }, [
            "../outside.json",
            "panels",
            "global",
        ]);

        await expect(restoreConfig(archive, config, data)).rejects.toThrow();

        expect(await fs.readJson(path.join(config, "panels", "old.json"))).toEqual({ id: "old" });
        expect(await fs.readJson(path.join(config, "global", "settings.json"))).toEqual({ title: "old" });
    });

    test("rejects concurrent restore requests", async () => {
        await createArchive();
        const copy = fs.copy;
        let release;
        let notifyStarted;
        const started = new Promise((resolve) => {
            notifyStarted = resolve;
        });
        const paused = new Promise((resolve) => {
            release = resolve;
        });
        jest.spyOn(fs, "copy").mockImplementation(async (source, destination, ...options) => {
            if (source === path.join(config, "panels")) {
                notifyStarted();
                await paused;
            }
            return copy(source, destination, ...options);
        });

        const firstRestore = restoreConfig(archive, config, data);
        await started;
        try {
            await expect(restoreConfig(archive, config, data)).rejects.toMatchObject({ code: "RESTORE_IN_PROGRESS" });
        } finally {
            release();
            await firstRestore;
        }
    });

    test("rolls back both directories when applying the backup fails", async () => {
        await createArchive();
        const copy = fs.copy;
        jest.spyOn(fs, "copy").mockImplementation(async (source, destination, ...options) => {
            if (source.endsWith("/extracted/global")) {
                throw new Error("disk write failed");
            }
            return copy(source, destination, ...options);
        });

        await expect(restoreConfig(archive, config, data)).rejects.toThrow("disk write failed");

        expect(await fs.readdir(path.join(config, "panels"))).toEqual(["old.json"]);
        expect(await fs.readJson(path.join(config, "global", "settings.json"))).toEqual({ title: "old" });
        expect(await fs.readdir(data)).toEqual([]);
    });

    test("retains recovery copies and reports their location if rollback fails", async () => {
        await createArchive();
        const copy = fs.copy;
        jest.spyOn(fs, "copy").mockImplementation(async (source, destination, ...options) => {
            if (source.endsWith("/extracted/global") || source.endsWith("/recovery/panels")) {
                throw new Error("disk write failed");
            }
            return copy(source, destination, ...options);
        });

        await expect(restoreConfig(archive, config, data)).rejects.toMatchObject({
            code: "RESTORE_ROLLBACK_INCOMPLETE",
        });

        const workspaces = await fs.readdir(data);
        expect(workspaces).toHaveLength(1);
        const recovery = path.join(data, workspaces[0], "recovery");
        expect(await fs.readJson(path.join(recovery, "panels", "old.json"))).toEqual({ id: "old" });
        expect(await fs.readJson(path.join(recovery, "global", "settings.json"))).toEqual({ title: "old" });
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(recovery));
    });
});
