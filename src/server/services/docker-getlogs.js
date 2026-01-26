"use strict";

const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

module.exports = async function panelLogGet(containerName, options = {}) {
    const container = docker.getContainer(containerName);

    // follow + tail defaults
    const logStream = await container.logs({
        stdout: true,
        stderr: true,
        follow: options.follow ?? true,
        tail: options.tail ?? 1000,
        timestamps: false,
    });

    // transform Docker multiplexed stream to clean text + type
    const { PassThrough } = require("stream");
    const cleanStream = new PassThrough({ objectMode: true });

    logStream.on("data", (chunk) => {
        if (chunk.length < 1) return;

        const streamType = chunk[0] === 2 ? "stderr" : "stdout"; // 1=stdout, 2=stderr
        const text = chunk.slice(8).toString("utf8"); // skip Docker header

        // emit object instead of raw chunk
        cleanStream.write({ text, type: streamType });
    });

    logStream.on("end", () => cleanStream.end());
    logStream.on("error", (err) => cleanStream.destroy(err));

    return cleanStream;
};
