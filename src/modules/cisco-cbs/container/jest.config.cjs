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

// Build Jest alias mappings directly from package.json _moduleAliases.
const moduleNameMapper = Object.entries(_moduleAliases).reduce((acc, [alias, target]) => {
    const escapedAlias = escapeRegExp(alias);
    const normalizedTarget = normalizeAliasTarget(target);

    // Support both `@alias` and `@alias/...` import styles.
    acc[`^${escapedAlias}$`] = `<rootDir>/${normalizedTarget}`.replace(/\/$/, "");
    acc[`^${escapedAlias}/(.*)$`] = `<rootDir>/${normalizedTarget}$1`;
    return acc;
}, {});

module.exports = {
    testEnvironment: "node",
    moduleNameMapper,
};
