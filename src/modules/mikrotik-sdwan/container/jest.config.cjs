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

const moduleNameMapper = Object.entries(_moduleAliases).reduce((acc, [alias, target]) => {
    const escapedAlias = escapeRegExp(alias);
    const normalizedTarget = normalizeAliasTarget(target);

    acc[`^${escapedAlias}$`] = `<rootDir>/${normalizedTarget}`.replace(/\/$/, "");
    acc[`^${escapedAlias}/(.*)$`] = `<rootDir>/${normalizedTarget}$1`;
    return acc;
}, {});

module.exports = {
    testEnvironment: "node",
    moduleNameMapper,
};
