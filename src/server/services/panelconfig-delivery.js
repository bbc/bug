"use strict";

const { createHash } = require("crypto");

const delivered = new Map();

const fingerprint = (config) => createHash("sha256").update(JSON.stringify(config)).digest("hex");

exports.get = (config, needsContainer) => {
    if (!needsContainer) return "not-required";
    const record = delivered.get(config.id);
    return record && record.fingerprint === fingerprint(config) ? "accepted" : "pending";
};

exports.matches = (config, container) => {
    const record = delivered.get(config.id);
    return (
        record &&
        record.fingerprint === fingerprint(config) &&
        record.containerId === container.Id &&
        record.startedAt === container.State.StartedAt
    );
};

exports.accept = (config, container) => {
    delivered.set(config.id, {
        fingerprint: fingerprint(config),
        containerId: container.Id,
        startedAt: container.State.StartedAt,
    });
};

exports.clear = (panelId) => delivered.delete(panelId);

exports.retain = (panelIds) => {
    for (const panelId of delivered.keys()) {
        if (!panelIds.has(panelId)) delivered.delete(panelId);
    }
};
