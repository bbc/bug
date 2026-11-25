"use strict";

const fs = require("fs").promises;
const path = require("path");
const tar = require("tar");

module.exports = async (archivePath, extractPath) => {
    const file = await fs.open(archivePath, "r");
    const header = Buffer.alloc(2);
    try {
        const { bytesRead } = await file.read(header, 0, header.length, 0);
        if (bytesRead !== 2 || header[0] !== 0x1f || header[1] !== 0x8b) {
            throw new Error("Backup is not a gzip archive");
        }
    } finally {
        await file.close();
    }

    let invalidEntry;
    await tar.x({
        file: archivePath,
        cwd: extractPath,
        strict: true,
        filter: (entryPath, entry) => {
            const relativePath = entryPath.replace(/^(\.\/)+/, "");
            const parts = relativePath.split("/");
            const valid =
                !path.posix.isAbsolute(entryPath) &&
                !entryPath.includes("\\") &&
                !parts.includes("..") &&
                !parts.includes(".") &&
                ["panels", "global"].includes(parts[0]) &&
                ["File", "Directory", "OldFile"].includes(entry.type);
            if (!valid) {
                invalidEntry = entryPath;
            }
            return valid;
        },
    });

    if (invalidEntry) {
        throw new Error(`Invalid backup entry: ${invalidEntry}`);
    }
};
