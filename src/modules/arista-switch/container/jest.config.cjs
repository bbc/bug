const fs = require("fs");
const path = require("path");
const { _moduleAliases = {} } = require("./package.json");

// Escape alias strings before using them in regex patterns.
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Convert package alias targets into rootDir-relative paths.
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

    if (fs.existsSync(localTargetPath)) {
        return normalized;
    }

    if (alias === "@core") {
        return "../../../server/core/";
    }

    return normalized;
}

// Build Jest alias mappings directly from package.json _moduleAliases.
const moduleNameMapper = Object.entries(_moduleAliases).reduce((acc, [alias, target]) => {
    const escapedAlias = escapeRegExp(alias);
    const normalizedTarget = resolveAliasTarget(alias, target);

    // Support both `@alias` and `@alias/...` import styles.
    acc[`^${escapedAlias}$`] = `<rootDir>/${normalizedTarget}`.replace(/\/$/, "");
    acc[`^${escapedAlias}/(.*)$`] = `<rootDir>/${normalizedTarget}$1`;
    return acc;
}, {});

module.exports = {
    testEnvironment: "node",
    moduleNameMapper,
};
