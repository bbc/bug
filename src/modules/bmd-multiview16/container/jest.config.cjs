const fs = require("fs");
const path = require("path");
const { _moduleAliases = {} } = require("./package.json");

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeAliasTarget(target) {
    if (!target || target === ".") {
        return "";
    }

    const withoutPrefix = target.replace(/^\.\//, "");
    return withoutPrefix.endsWith("/") ? withoutPrefix : `${withoutPrefix}/`;
}

function resolveAliasTarget(alias, target) {
    const normalized = normalizeAliasTarget(target);
    const localTargetPath = path.join(__dirname, normalized);

    if (alias === "@core") {
        const localLoggerPath = path.join(localTargetPath, "logger.js");
        if (fs.existsSync(localLoggerPath)) {
            return normalized;
        }
        return "../../../server/core/";
    }

    if (fs.existsSync(localTargetPath)) {
        return normalized;
    }

    return normalized;
}

const moduleNameMapper = Object.entries(_moduleAliases).reduce((acc, [alias, target]) => {
    const escapedAlias = escapeRegExp(alias);
    const normalizedTarget = resolveAliasTarget(alias, target);

    acc[`^${escapedAlias}$`] = `<rootDir>/${normalizedTarget}`.replace(/\/$/, "");
    acc[`^${escapedAlias}/(.*)$`] = `<rootDir>/${normalizedTarget}$1`;
    return acc;
}, {});

module.exports = {
    testEnvironment: "node",
    moduleNameMapper,
};